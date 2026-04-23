package com.library.system.service;

import com.library.system.entity.Book;
import com.library.system.entity.IssueRecord;
import com.library.system.entity.Member;
import com.library.system.repository.BookRepository;
import com.library.system.repository.IssueRecordRepository;
import com.library.system.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LibraryService {

    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final IssueRecordRepository issueRecordRepository;

    @Transactional
    public IssueRecord issueBook(Long bookId, Long memberId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Book is not currently available");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        IssueRecord issueRecord = new IssueRecord();
        issueRecord.setBook(book);
        issueRecord.setMember(member);
        issueRecord.setIssueDate(LocalDate.now());
        issueRecord.setDueDate(LocalDate.now().plusDays(14)); // 14 days issue period
        issueRecord.setStatus(IssueRecord.Status.ISSUED);

        return issueRecordRepository.save(issueRecord);
    }

    @Transactional
    public IssueRecord returnBook(Long bookId, Long memberId) {
        IssueRecord issueRecord = issueRecordRepository.findByMemberIdAndBookIdAndStatus(memberId, bookId, IssueRecord.Status.ISSUED)
                .orElseThrow(() -> new RuntimeException("Active issue record not found for this book and member"));

        issueRecord.setStatus(IssueRecord.Status.RETURNED);
        issueRecord.setReturnDate(LocalDate.now());
        
        Book book = issueRecord.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return issueRecordRepository.save(issueRecord);
    }

    public List<IssueRecord> getIssueRecordsByMember(Long memberId) {
        return issueRecordRepository.findByMemberId(memberId);
    }

    public List<IssueRecord> getAllIssues() {
        return issueRecordRepository.findAll();
    }
}
