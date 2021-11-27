package pl.siekiera.budgetify.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import pl.siekiera.budgetify.dto.outgoing.FileResponse;
import pl.siekiera.budgetify.exception.FileTypeNotAllowedException;
import pl.siekiera.budgetify.model.Image;
import pl.siekiera.budgetify.service.FileService;

import java.io.IOException;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class FileController {

    FileService fileService;

    public final static String imagesDirectory = "/files/images";

    @PostMapping("/files/upload")
    public ResponseEntity<FileResponse> upload(@RequestParam("file") MultipartFile file) {
        try {
            String path = fileService.uploadFile(file.getInputStream());
            if (path == null) {
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
            return new ResponseEntity<>(new FileResponse(path), HttpStatus.CREATED);
        } catch (FileTypeNotAllowedException e) {
            return new ResponseEntity<>(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = imagesDirectory + "/{file}")
    public ResponseEntity<byte[]> getImage(@PathVariable("file") String name) {
        Image image = fileService.getImage(name);
        if (image == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().contentType(image.getType()).body(image.getBody());
    }

}
