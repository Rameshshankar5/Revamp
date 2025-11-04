package com.revamp.customer.web;

import com.revamp.customer.model.Vehicle;
import com.revamp.customer.repo.VehicleRepo;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

  private final VehicleRepo vehicles;

  @GetMapping
  public ResponseEntity<List<Vehicle>> listMine() {
    String uid = CurrentUser.userId();
    if (uid == null) return ResponseEntity.status(401).build();
    return ResponseEntity.ok(vehicles.findByCustomerUserId(uid));
  }

  @PostMapping
  public ResponseEntity<Vehicle> create(@Valid @RequestBody Vehicle body) {
    String uid = CurrentUser.userId();
    if (uid == null) return ResponseEntity.status(401).build();

    body.setId(null);
    body.setCustomerUserId(uid);
    Vehicle saved = vehicles.save(body);
    return ResponseEntity.created(URI.create("/api/vehicles/" + saved.getId())).body(saved);
  }
}
