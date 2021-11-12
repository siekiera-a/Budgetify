package pl.siekiera.budgetify.service;

import pl.siekiera.budgetify.exception.FileTypeNotAllowedException;

import java.io.InputStream;

public interface FileService {

    String uploadFile(InputStream stream) throws FileTypeNotAllowedException;

}
