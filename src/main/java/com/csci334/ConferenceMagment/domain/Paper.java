package com.csci334.ConferenceMagment.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="paper")
public class Paper {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double score;
    private String status;

    @OneToMany(cascade=CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
    @ManyToMany(cascade=CascadeType.ALL)
    private List<User> authors = new ArrayList<>();

    @OneToMany(cascade=CascadeType.ALL)
    private List<User> reviewer = new ArrayList<>();

    @ManyToOne(cascade=CascadeType.ALL)
    private File file;




    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }

    public List<User> getReviewer() {
        return reviewer;
    }

    public void setReviewer(List<User> reviewer) {
        this.reviewer = reviewer;
    }

    public void addAuthor(User user){
        authors.add(user);
    }

    public void addComment(Comment comment){
        comments.add(comment);
    }

    public void addReviewer(User user){
        reviewer.add(user);
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<User> getAuthors() {
        return authors;
    }

    public void setAuthors(List<User> authors) {
        this.authors = authors;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
