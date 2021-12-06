package pl.siekiera.budgetify.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.siekiera.budgetify.dto.incoming.CreateGroupRequest;
import pl.siekiera.budgetify.dto.outgoing.GroupDetailsResponse;
import pl.siekiera.budgetify.dto.outgoing.GroupResponse;
import pl.siekiera.budgetify.entity.GroupEntity;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.service.GroupService;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/group")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class GroupController {

    GroupService groupService;

    @PostMapping
    public ResponseEntity<GroupResponse> create(@RequestBody @Valid CreateGroupRequest request,
                                                Authentication authentication) {
        UserEntity me = (UserEntity) authentication.getPrincipal();
        GroupEntity group = groupService.create(request, me);
        return new ResponseEntity<>(new GroupResponse(group), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<GroupResponse>> getGroups(Authentication authentication) {
        UserEntity me = (UserEntity) authentication.getPrincipal();
        List<GroupEntity> groups = groupService.findAll(me);
        return new ResponseEntity<>(groups.stream()
            .map(GroupResponse::new)
            .collect(Collectors.toUnmodifiableList()), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDetailsResponse> getGroupDetails(@PathVariable long id,
                                                                Authentication authentication) {
        var me = (UserEntity) authentication.getPrincipal();
        var details = groupService.getPersonalizedGroupDetails(id, me);
        if (details == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(details);
    }

}
