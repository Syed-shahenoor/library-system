package com.library.system.controller;

import com.library.system.entity.IssueRecord;
import com.library.system.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;

    @PostMapping("/issue")
    public ResponseEntity<IssueRecord> issueBook(@RequestParam Long bookId, @RequestParam Long memberId) {
        return ResponseEntity.ok(libraryService.issueBook(bookId, memberId));
    }

    @PostMapping("/return")
    public ResponseEntity<IssueRecord> returnBook(@RequestParam Long bookId, @RequestParam Long memberId) {
        return ResponseEntity.ok(libraryService.returnBook(bookId, memberId));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<IssueRecord>> getIssueRecordsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(libraryService.getIssueRecordsByMember(memberId));
    }
}
