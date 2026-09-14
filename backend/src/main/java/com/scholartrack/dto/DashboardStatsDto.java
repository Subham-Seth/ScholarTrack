package com.scholartrack.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {

    public static class StudentDashboardStats {
        private String studentName;
        private int profileCompletionPct;
        private long totalRecommended;
        private long totalEligible;
        private long activeApplications;
        private long pendingDocuments;
        private long unreadNotifications;
        private List<ApplicationDtos.ApplicationSummaryDto> recentApplications;
        private List<ScholarshipDto> recommendedScholarships;
        private List<NotificationDto> recentAlerts;

        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }
        public int getProfileCompletionPct() { return profileCompletionPct; }
        public void setProfileCompletionPct(int profileCompletionPct) { this.profileCompletionPct = profileCompletionPct; }
        public long getTotalRecommended() { return totalRecommended; }
        public void setTotalRecommended(long totalRecommended) { this.totalRecommended = totalRecommended; }
        public long getTotalEligible() { return totalEligible; }
        public void setTotalEligible(long totalEligible) { this.totalEligible = totalEligible; }
        public long getActiveApplications() { return activeApplications; }
        public void setActiveApplications(long activeApplications) { this.activeApplications = activeApplications; }
        public long getPendingDocuments() { return pendingDocuments; }
        public void setPendingDocuments(long pendingDocuments) { this.pendingDocuments = pendingDocuments; }
        public long getUnreadNotifications() { return unreadNotifications; }
        public void setUnreadNotifications(long unreadNotifications) { this.unreadNotifications = unreadNotifications; }
        public List<ApplicationDtos.ApplicationSummaryDto> getRecentApplications() { return recentApplications; }
        public void setRecentApplications(List<ApplicationDtos.ApplicationSummaryDto> recentApplications) { this.recentApplications = recentApplications; }
        public List<ScholarshipDto> getRecommendedScholarships() { return recommendedScholarships; }
        public void setRecommendedScholarships(List<ScholarshipDto> recommendedScholarships) { this.recommendedScholarships = recommendedScholarships; }
        public List<NotificationDto> getRecentAlerts() { return recentAlerts; }
        public void setRecentAlerts(List<NotificationDto> recentAlerts) { this.recentAlerts = recentAlerts; }
    }

    public static class AdminDashboardStats {
        private long totalApplications;
        private long pendingReview;
        private long verifiedApplications;
        private long approvedApplications;
        private long rejectedApplications;
        private long potentialDuplicates;
        private long highRiskAlerts;
        private Map<String, Long> statusDistribution;
        private Map<String, Long> scholarshipPopularity;
        private Map<String, Long> riskDistribution;
        private List<ApplicationDtos.ApplicationSummaryDto> highPriorityQueue;

        public long getTotalApplications() { return totalApplications; }
        public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }
        public long getPendingReview() { return pendingReview; }
        public void setPendingReview(long pendingReview) { this.pendingReview = pendingReview; }
        public long getVerifiedApplications() { return verifiedApplications; }
        public void setVerifiedApplications(long verifiedApplications) { this.verifiedApplications = verifiedApplications; }
        public long getApprovedApplications() { return approvedApplications; }
        public void setApprovedApplications(long approvedApplications) { this.approvedApplications = approvedApplications; }
        public long getRejectedApplications() { return rejectedApplications; }
        public void setRejectedApplications(long rejectedApplications) { this.rejectedApplications = rejectedApplications; }
        public long getPotentialDuplicates() { return potentialDuplicates; }
        public void setPotentialDuplicates(long potentialDuplicates) { this.potentialDuplicates = potentialDuplicates; }
        public long getHighRiskAlerts() { return highRiskAlerts; }
        public void setHighRiskAlerts(long highRiskAlerts) { this.highRiskAlerts = highRiskAlerts; }
        public Map<String, Long> getStatusDistribution() { return statusDistribution; }
        public void setStatusDistribution(Map<String, Long> statusDistribution) { this.statusDistribution = statusDistribution; }
        public Map<String, Long> getScholarshipPopularity() { return scholarshipPopularity; }
        public void setScholarshipPopularity(Map<String, Long> scholarshipPopularity) { this.scholarshipPopularity = scholarshipPopularity; }
        public Map<String, Long> getRiskDistribution() { return riskDistribution; }
        public void setRiskDistribution(Map<String, Long> riskDistribution) { this.riskDistribution = riskDistribution; }
        public List<ApplicationDtos.ApplicationSummaryDto> getHighPriorityQueue() { return highPriorityQueue; }
        public void setHighPriorityQueue(List<ApplicationDtos.ApplicationSummaryDto> highPriorityQueue) { this.highPriorityQueue = highPriorityQueue; }
    }

    public static class NotificationDto {
        private Long id;
        private String title;
        private String message;
        private String type;
        private boolean isRead;
        private String createdAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public boolean isRead() { return isRead; }
        public void setRead(boolean read) { isRead = read; }
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }
}
