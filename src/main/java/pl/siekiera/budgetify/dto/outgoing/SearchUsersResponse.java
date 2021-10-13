package pl.siekiera.budgetify.dto.outgoing;

import lombok.Value;
import org.springframework.data.domain.Page;
import pl.siekiera.budgetify.entity.UserEntity;
import pl.siekiera.budgetify.model.User;

import java.util.List;

@Value
public class SearchUsersResponse {

    List<User> users;
    String searchTerm;
    int totalPages;
    int currentPage;
    long totalCount;

    public SearchUsersResponse(Page<UserEntity> users, String searchTerm) {
        this.searchTerm = searchTerm;
        this.users = users.map(User::new).getContent();
        totalPages = users.getTotalPages();
        currentPage = users.getNumber();
        totalCount = users.getTotalElements();
    }

}
