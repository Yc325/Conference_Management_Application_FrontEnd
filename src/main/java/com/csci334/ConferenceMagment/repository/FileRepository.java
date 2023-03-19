package com.csci334.ConferenceMagment.repository;

import com.csci334.ConferenceMagment.domain.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, String> {
}
