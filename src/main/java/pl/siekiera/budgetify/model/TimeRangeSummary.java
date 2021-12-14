package pl.siekiera.budgetify.model;

import lombok.Value;

import java.time.LocalDateTime;

@Value
public class TimeRangeSummary {

    double total;
    double expenses;
    double settled;
    double waiting;
    double notPaid;
    LocalDateTime from;
    LocalDateTime to;

}
