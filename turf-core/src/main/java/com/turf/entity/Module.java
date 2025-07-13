package com.turf.entity;

import jakarta.persistence.*;
import java.util.Set;
import java.util.UUID;

/**
 * Entity representing a Module in the system.
 *
 * @author Saravanamuthukumar S
 */
@Entity
@Table(name = "modules")
public class Module {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "modules")
    private Set<Role> roles;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
} 