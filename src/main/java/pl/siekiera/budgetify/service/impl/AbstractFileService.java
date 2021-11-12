package pl.siekiera.budgetify.service.impl;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.apache.tika.config.TikaConfig;
import org.apache.tika.detect.Detector;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.mime.MediaType;
import org.apache.tika.mime.MimeTypeException;
import org.apache.tika.mime.MimeTypes;
import org.springframework.util.MimeTypeUtils;
import pl.siekiera.budgetify.service.FileService;

import java.io.IOException;
import java.io.InputStream;
import java.util.Set;
import java.util.UUID;

@FieldDefaults(makeFinal = true, level = AccessLevel.PROTECTED)
public abstract class AbstractFileService implements FileService {

    Detector detector;
    MimeTypes mimeTypes;
    Set<String> allowedTypes;

    public AbstractFileService() {
        TikaConfig config = TikaConfig.getDefaultConfig();
        detector = config.getDetector();
        mimeTypes = config.getMimeRepository();

        allowedTypes = Set.of(
            MimeTypeUtils.IMAGE_JPEG_VALUE,
            MimeTypeUtils.IMAGE_PNG_VALUE,
            MimeTypeUtils.IMAGE_GIF_VALUE
        );
    }

    protected boolean isAllowedFileType(MediaType type) {
        if (type == null) {
            return false;
        }
        return allowedTypes.contains(type.toString());
    }

    protected MediaType getMediaType(InputStream stream) {
        Metadata metadata = new Metadata();
        try {
            return detector.detect(stream, metadata);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    protected String createFileNameWithExtension(MediaType type) {
        try {
            String extension = mimeTypes.forName(type.toString()).getExtension();
            String fileName = UUID.randomUUID().toString();
            return fileName + extension;
        } catch (MimeTypeException e) {
            return null;
        }
    }

}
