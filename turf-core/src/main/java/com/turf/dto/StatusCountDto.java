package com.turf.dto;

public class StatusCountDto {
    private long pending;
    private long confirmed;
    private long cancelled;
    private long completed;
    private long total;

    public StatusCountDto() {}

    public StatusCountDto(long pending, long confirmed, long cancelled, long completed, long total) {
        this.pending = pending;
        this.confirmed = confirmed;
        this.cancelled = cancelled;
        this.completed = completed;
        this.total = total;
    }

    public long getPending() {
        return pending;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }

    public long getConfirmed() {
        return confirmed;
    }

    public void setConfirmed(long confirmed) {
        this.confirmed = confirmed;
    }

    public long getCancelled() {
        return cancelled;
    }

    public void setCancelled(long cancelled) {
        this.cancelled = cancelled;
    }

    public long getCompleted() {
        return completed;
    }

    public void setCompleted(long completed) {
        this.completed = completed;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }
}