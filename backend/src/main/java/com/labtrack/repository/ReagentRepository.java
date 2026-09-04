package com.labtrack.repository;

import com.labtrack.model.Reagent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReagentRepository extends JpaRepository<Reagent, Long> {

    List<Reagent> findAllByOrderByExpiryDateAsc();

    List<Reagent> findByNameContainingIgnoreCaseOrderByExpiryDateAsc(String name);

    @Query("SELECT r FROM Reagent r WHERE r.expiryDate < :today ORDER BY r.expiryDate ASC")
    List<Reagent> findExpiredReagents(@Param("today") LocalDate today);

    @Query("SELECT r FROM Reagent r WHERE r.expiryDate >= :today AND r.expiryDate <= :thresholdDate ORDER BY r.expiryDate ASC")
    List<Reagent> findExpiringSoonReagents(@Param("today") LocalDate today, @Param("thresholdDate") LocalDate thresholdDate);

    @Query("SELECT r FROM Reagent r WHERE r.expiryDate > :thresholdDate ORDER BY r.expiryDate ASC")
    List<Reagent> findGoodReagents(@Param("thresholdDate") LocalDate thresholdDate);
}
