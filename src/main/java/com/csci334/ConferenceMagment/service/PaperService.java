package com.csci334.ConferenceMagment.service;

import com.csci334.ConferenceMagment.domain.File;
import com.csci334.ConferenceMagment.domain.Paper;
import com.csci334.ConferenceMagment.domain.User;
import com.csci334.ConferenceMagment.domain.exception.PaperNotFoundException;
import com.csci334.ConferenceMagment.domain.exception.userNotFoundException;
import com.csci334.ConferenceMagment.repository.PaperRepository;
import com.csci334.ConferenceMagment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.Set;

@Service
public class PaperService {

    @Autowired
    private PaperRepository paperRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileService fileService;

    public Paper save(User user) {
        User author = userRepository.findByUsername(user.getUsername()).orElseThrow(()-> new userNotFoundException(user.getUsername()));
        Paper paper = new Paper();
//        File file = new File();
//        paper.setFile(file);
        paper.setStatus("Needs to be submitted");
        paper.addAuthor(author);
        return paperRepository.save(paper);
    }
    public Paper addAuthorToPaper(Long paperId,String username){
        User author = userRepository.findByUsername(username).orElseThrow(()-> new userNotFoundException(username));
        Paper paper = getPaper(paperId);
        paper.addAuthor(author);
        return paperRepository.save(paper);
    }


    public Set<Paper> findByAuthors(User user){
        return paperRepository.findByAuthors(user);
    }

    public Optional<Paper> findById(Long paperId) {
        return paperRepository.findById(paperId);
    }

    public Paper getPaper(Long paperId) {
        return paperRepository.findById(paperId).orElseThrow(()-> new PaperNotFoundException(paperId));
    }
    @Transactional
    public Paper addFile(Long paperId, MultipartFile file) {
        Paper paper = getPaper(paperId);
        File fileName = fileService.storeFile(file);
        paper.setFile(fileName);
        paper.setName(fileName.getFileName().split("\\.")[0]);
        paper.setStatus("Submitted");
        return paper;
    }

}
