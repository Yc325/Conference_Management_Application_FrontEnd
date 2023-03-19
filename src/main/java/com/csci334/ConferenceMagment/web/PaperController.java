package com.csci334.ConferenceMagment.web;

import com.csci334.ConferenceMagment.domain.File;
import com.csci334.ConferenceMagment.domain.Paper;
import com.csci334.ConferenceMagment.domain.User;
import com.csci334.ConferenceMagment.payload.Response;
import com.csci334.ConferenceMagment.service.FileService;
import com.csci334.ConferenceMagment.service.PaperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import org.springframework.core.io.Resource;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;


import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@RestController
@RequestMapping("/api/papers")
public class PaperController {
    @Autowired
    private PaperService paperService;

    @Autowired
    private FileService fileService;

    @PostMapping("")
    public ResponseEntity<?> createPaper(@AuthenticationPrincipal User user){
        Paper newPaper = paperService.save(user);
        return ResponseEntity.ok(newPaper);
    }

    @PostMapping("{paperId}")
    public ResponseEntity<?> uploadFileToPaper(@PathVariable Long paperId, @RequestParam MultipartFile file, @AuthenticationPrincipal User user){
        Paper paper  = paperService.addFile(paperId,file);
        return ResponseEntity.ok(paper);
    }

    @PostMapping("{paperid}/addauthor/{username}")
    public ResponseEntity<?> addAuthor(@PathVariable Long paperid, @PathVariable String username, @AuthenticationPrincipal User user) {
        Paper paper = paperService.addAuthorToPaper(paperid,username);
        return ResponseEntity.ok(paper);
    }


    @GetMapping("")
    public ResponseEntity<?> getPapers(@AuthenticationPrincipal User user){
       return ResponseEntity.ok(paperService.findByAuthors(user));

    }
    @GetMapping("{paperId}")
    public ResponseEntity<?> getPaper(@PathVariable Long paperId, @AuthenticationPrincipal User user){
        Optional<Paper> paper = paperService.findById(paperId);
        return ResponseEntity.ok(paper.orElse(new Paper()));
    }


    @PostMapping("/uploadFile")
    public Response uploadFile(@RequestParam MultipartFile file){
        File fileName = fileService.storeFile(file);

        String fileDowloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/dowloadFile/")
                .path(fileName.getFileName())
                .toUriString();
        return new Response(fileName.getFileName(), fileDowloadUri,file.getContentType(), file.getSize());
    }

    @GetMapping("/dowloadFile/{fileId:.+}")
    public ResponseEntity<byte[]> dowloadFile(@PathVariable String fileId){

        File file = fileService.getFile(fileId);

        HttpHeaders header = new HttpHeaders();

        header.setContentType(MediaType.valueOf(file.getFileType()));
        header.setContentLength(file.getData().length);
        header.set("Content-Disposition", "attachment; filename=" + file.getFileName());
        return new ResponseEntity<>(file.getData(), header, HttpStatus.OK);
    }

}
