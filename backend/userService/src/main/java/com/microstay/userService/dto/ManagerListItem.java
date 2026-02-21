package com.microstay.userService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ManagerListItem {
    private String id;
    private String name;
    private String email;
    private boolean enabled;
}
