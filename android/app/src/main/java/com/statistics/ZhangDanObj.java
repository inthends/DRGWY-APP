package com.statistics;

import java.io.Serializable;

import androidx.annotation.Nullable;

public class ZhangDanObj extends Object implements Serializable {
    private String feeName;
    private String amount;
    private String beginDate;
    private String endDate;

    public ZhangDanObj(@Nullable String feeName, @Nullable String amount, @Nullable String beginDate, @Nullable String endDate) {
        this.feeName = feeName != null ? feeName : "";
        this.amount = amount != null ? amount : "";
        this.beginDate = beginDate != null ? beginDate : "";
        this.endDate = endDate != null ? endDate : "";
    }

    public String getFeeName() {
        return feeName;
    }

    public String getAmount() {
        return amount;
    }

    public String getBeginDate() {
        return beginDate;
    }

    public String getEndDate() {
        return endDate;
    }


}
