package com.library.system.repository;

import com.library.system.entity.IssueRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRecordRepository extends JpaRepository<IssueRecord, Long> {
    List<IssueRecord> findByMemberId(Long memberId);
    List<IssueRecord> findByBookId(Long bookId);
    Optional<IssueRecord> findByMemberIdAndBookIdAndStatus(Long memberId, Long bookId, IssueRecord.Status status);
}
