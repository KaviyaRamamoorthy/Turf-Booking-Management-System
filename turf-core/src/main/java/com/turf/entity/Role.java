package com.turf.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import java.util.Optional;
import java.util.UUID;
import java.util.Set;

/**
 * Entity representing a role in the Turf Booking Platform.
 *
 * @author Kaviya Ramamoorthy
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany
    @JoinTable(
        name = "role_modules",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "module_id")
    )
    @EqualsAndHashCode.Exclude
    private Set<Module> modules;

    public Set<Module> getModules() { return modules; }
    public void setModules(Set<Module> modules) { this.modules = modules; }
} 