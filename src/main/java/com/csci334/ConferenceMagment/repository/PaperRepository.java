package com.csci334.ConferenceMagment.repository;

import com.csci334.ConferenceMagment.domain.Paper;
import com.csci334.ConferenceMagment.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface PaperRepository extends JpaRepository<Paper,Long> {

 Set<Paper> findByAuthors (User user);

}
