package pl.siekiera.budgetify.model;

import lombok.Value;
import org.springframework.http.MediaType;

@Value
public class Image {

    byte[] body;
    MediaType type;

}
