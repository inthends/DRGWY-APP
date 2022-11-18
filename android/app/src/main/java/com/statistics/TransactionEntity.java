package com.statistics;

import java.io.Serializable;

/**
 * 公司：拉卡拉
 * 创建者：liuqianlong@lakala.com
 * 创建时间：2017/2/28 17:26.
 * 说明：交易详情对象实体类
 * 修改者：
 * 修改时间：
 * 修改详情：
 */
public class TransactionEntity implements Serializable {

    private static final long serialVersionUID = 5390682994083594853L;

    private String merid;//商户号
    private String termid;//终端号
    private String batchno;//批次号
    private String systraceno;//凭证号
    private String authcode;//授权号
    private String orderid_scan;//扫码订单号
    private String translocaltime;//交易时间
    private String translocaldate;//交易日期
    private String transamount;//交易金额
    public String priaccount;//卡号
    public String pay_tp;//交易类型
    public String refernumber;//系统参考号
    public String amt;//金额

    public String getAmt() {
        return amt;
    }

    public void setAmt(String amt) {
        this.amt = amt;
    }

    public String getMerid() {
        return merid;
    }

    public void setMerid(String merid) {
        this.merid = merid;
    }

    public String getTermid() {
        return termid;
    }

    public void setTermid(String termid) {
        this.termid = termid;
    }

    public String getBatchno() {
        return batchno;
    }

    public void setBatchno(String batchno) {
        this.batchno = batchno;
    }

    public String getSystraceno() {
        return systraceno;
    }

    public void setSystraceno(String systraceno) {
        this.systraceno = systraceno;
    }

    public String getAuthcode() {
        return authcode;
    }

    public void setAuthcode(String authcode) {
        this.authcode = authcode;
    }

    public String getOrderid_scan() {
        return orderid_scan;
    }

    public void setOrderid_scan(String orderid_scan) {
        this.orderid_scan = orderid_scan;
    }

    public String getTranslocaltime() {
        return translocaltime;
    }

    public void setTranslocaltime(String translocaltime) {
        this.translocaltime = translocaltime;
    }

    public String getTranslocaldate() {
        return translocaldate;
    }

    public void setTranslocaldate(String translocaldate) {
        this.translocaldate = translocaldate;
    }

    public String getTransamount() {
        return transamount;
    }

    public void setTransamount(String transamount) {
        this.transamount = transamount;
    }

    public String getPriaccount() {
        return priaccount;
    }

    public void setPriaccount(String priaccount) {
        this.priaccount = priaccount;
    }

    public String getPay_tp() {
        return pay_tp;
    }

    public void setPay_tp(String pay_tp) {
        this.pay_tp = pay_tp;
    }

    public String getRefernumber() {
        return refernumber;
    }

    public void setRefernumber(String refernumber) {
        this.refernumber = refernumber;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    @Override
    public String toString() {
        return "========================\n\r 商户号=" + merid + "\n\r 终端号=" + termid
                + "\n\r 批次号=" + batchno + "\n\r 凭证号=" + systraceno
                + "\n\r 授权号=" + authcode + "\n\r 扫码订单号=" + orderid_scan
                + "\n\r 交易时间=" + translocaltime + "\n\r 交易日期="
                + translocaldate + "\n\r 交易金额=" + transamount
                + "\n\r 卡号=" + priaccount + "\n\r 交易类型=" + pay_tp
                + "\n\r 系统参考号=" + refernumber + "\n\r 金额=" + amt;
    }
}
