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
import pl.siekiera.budgetify.exception.FileTypeNotAllowedException;
import pl.siekiera.budgetify.model.Image;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;

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

    private Path getUploadPath(MediaType type) {
        String fileName = createFileNameWithExtension(type);
        return Path.of(uploadDir.toString(), fileName);
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

        Path filePath = getUploadPath(mediaType);

        try {
            Files.copy(stream, filePath);
        } catch (FileAlreadyExistsException e) {
            filePath = getUploadPath(mediaType);
            try {
                Files.copy(stream, filePath);
            } catch (IOException ioException) {
                log.error(e);
            }
        } catch (IOException e) {
            log.error(e);
            return null;
        }

        try {
            bufferedStream.close();
        } catch (IOException e) {
            log.error("Stream close error", e);
        }

        log.info(String.format("File: %s uploaded to %s directory",
            filePath.getFileName(), uploadDir.toAbsolutePath()));
        return filePath.toString();
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
}
