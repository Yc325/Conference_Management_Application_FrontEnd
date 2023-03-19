package com.csci334.ConferenceMagment.service;

import com.csci334.ConferenceMagment.domain.File;
import com.csci334.ConferenceMagment.domain.exception.FileNotFoundException;
import com.csci334.ConferenceMagment.domain.exception.FileStorageException;
import com.csci334.ConferenceMagment.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class FileService {
    @Autowired
    private FileRepository fileRepository;

    public File storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try{
            if(fileName.contains("..")){
                throw new FileStorageException("Sorry file name contains invalid path"+fileName);
            }
            File dbFile = new File(fileName,file.getContentType(),file.getBytes());
            fileRepository.save(dbFile);
            return dbFile;
        }catch (IOException ex){
            throw new FileStorageException("could not store file " + fileName + ". Please try again",ex);
        }
    }
    public File getFile(String fileId){
        return fileRepository.findById(fileId)
                .orElseThrow(()-> new FileNotFoundException("File not Found with id" + fileId));
    }
}
