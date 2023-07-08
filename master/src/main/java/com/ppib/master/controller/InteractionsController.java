package com.ppib.master.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.ppib.master.repository.InteractionRepository;

@Controller
public class InteractionController {
        private final InteractionRepository repository;
        
        @Autowired
        public InteractionController(InteractionRepository repository) {
                this.repository = repository;
        }
        
}