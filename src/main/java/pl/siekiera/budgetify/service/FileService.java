package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.exception.FileTypeNotAllowedException;
import pl.siekiera.budgetify.model.Image;

import java.io.InputStream;

public interface FileService {

    String uploadFile(InputStream stream) throws FileTypeNotAllowedException;

    Image getImage(String name);

}
