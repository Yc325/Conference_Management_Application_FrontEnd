package com.csci334.ConferenceMagment.domain;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    private Paper paper;
    @OneToOne
    private User confChair;
    @OneToOne
    private User author;

    public Paper getPaper() {
        return paper;
    }

    public void setPaper(Paper paper) {
        this.paper = paper;
    }

    private LocalDate date;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getConfChair() {
        return confChair;
    }

    public void setConfChair(User confChair) {
        this.confChair = confChair;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }






}
