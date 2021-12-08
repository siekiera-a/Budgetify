package pl.siekiera.budgetify.service.impl;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.tika.Tika;
import org.apache.tika.mime.MediaType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.InvalidMediaTypeException;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pl.siekiera.budgetify.controller.FileController;
import pl.siekiera.budgetify.exception.FileTypeNotAllowedException;
import pl.siekiera.budgetify.model.Image;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class FileServiceImpl extends AbstractFileService {

    Log log = LogFactory.getLog(this.getClass());
    Path uploadDir;
    Tika tika;

    public FileServiceImpl(@Value("${upload.directory}") String path) throws Exception {
        if (path == null || path.isBlank()) {
            throw new Exception("Upload directory not provided!");
        }
        Path dir = Path.of(path);
        try {
            uploadDir = Files.createDirectories(dir);
        } catch (Exception e) {
            throw new Exception("Could not create directory: " + dir.toString(), e);
        }

        tika = new Tika();
    }

    @Override
    public String uploadFile(InputStream stream) throws FileTypeNotAllowedException {
        BufferedInputStream bufferedStream = new BufferedInputStream(stream);
        MediaType mediaType = getMediaType(bufferedStream);

        if (mediaType == null) {
            return null;
        }

        if (!isAllowedFileType(mediaType)) {
            throw new FileTypeNotAllowedException(mediaType + " not allowed!");
        }

        String fileName = createFileNameWithExtension(mediaType);
        Path filePath = Path.of(uploadDir.toString(), fileName);
        byte[] bytes;

        try {
            bytes = bufferedStream.readAllBytes();
            bufferedStream.close();
            Files.write(filePath, bytes, StandardOpenOption.CREATE_NEW);
        } catch (IOException e) {
            log.error(e);
            try {
                bufferedStream.close();
            } catch (IOException err) {
                log.error(err);
            }
            return null;
        }

        log.info(String.format("File: %s uploaded to %s directory",
            filePath.getFileName(), uploadDir.toAbsolutePath()));
        return getFilePath(fileName);
    }

    @Override
    public Image getImage(String name) {
        if (name == null || name.isBlank()) {
            return null;
        }

        Path filePath = Path.of(uploadDir.toString(), name);

        if (!Files.exists(filePath)) {
            return null;
        }

        try {
            byte[] bytes = Files.readAllBytes(filePath);
            String mediaType = tika.detect(name);
            org.springframework.http.MediaType type =
                org.springframework.http.MediaType.valueOf(mediaType);
            return new Image(bytes, type);
        } catch (InvalidMediaTypeException e) {
            log.info("Could not get media type from name: " + name);
        } catch (Exception e) {
            log.error(String.format("Could not read file: %s", filePath));
        }

        return null;
    }

    private String getFilePath(String filename) {
        return ServletUriComponentsBuilder.fromCurrentRequest()
            .replacePath(FileController.imagesDirectory)
            .path("/" + filename)
            .build()
            .toString();
    }

}
