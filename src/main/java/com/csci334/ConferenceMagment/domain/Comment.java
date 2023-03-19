package com.csci334.ConferenceMagment.domain;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String comment;
    private LocalDate postedAt;
    @ManyToOne(optional = false)
    private User reviewer;
    @ManyToOne(optional = false)
    private Paper paper;


    public User getReviewer() {
        return reviewer;
    }

    public void setReviewer(User reviwer) {
        this.reviewer = reviwer;
    }

    public Paper getPaper() {
        return paper;
    }

    public void setPaper(Paper paper) {
        this.paper = paper;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDate getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDate postedAt) {
        this.postedAt = postedAt;
    }
}
