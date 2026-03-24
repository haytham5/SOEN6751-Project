import {
  Building2,
  CheckCircle,
  Clock,
  ThumbsUp,
  TriangleAlert,
} from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Report } from "../data/reportSH";

const buildingColorMap: Record<string, string> = {
  EV: "#FF9898",
  H: "#4CAF50",
  FB: "#a683eb",
  JMSB: "#2196F3",
  LB: "#FFC107",
};

type Props = {
  report: Report;
  currentUserId: string | null;
  currentUserRole: string | null;
  isGuest: boolean;
  onUpvote: (id: string) => void;
  onResolve: (id: string) => void;
  onVerify?: (id: string) => void;
  onMarkSevere?: (id: string) => void;
  onChevronPress: (report: Report) => void;
  styles: any;
  normalizeBuildingId: (id?: string) => string;
};

export default function ReportCard({
                                     report,
                                     currentUserId,
                                     currentUserRole,
                                     isGuest,
                                     onUpvote,
                                     onResolve,
                                     onVerify,
                                     onMarkSevere,
                                     onChevronPress,
                                     styles,
                                     normalizeBuildingId,
                                   }: Props) {
  const hasUpvoted = currentUserId
      ? report.upvotedBy?.includes(currentUserId)
      : false;

  const hasResolved = currentUserId
      ? (report.resolvedBy ?? []).includes(currentUserId)
      : false;

  const hasVerified = currentUserId
      ? (report.verifiedBy ?? []).includes(currentUserId)
      : false;

  const hasMarkedSevere = currentUserId
      ? (report.severeBy ?? []).includes(currentUserId)
      : false;

  const isDisabled = isGuest || !currentUserId;

  const typeIcon = report.type === "accessibility" ? "accessible" : "campaign";
  const typeLabel = report.accessibilitySubtype
      ? report.accessibilitySubtype.replace("_", " ")
      : report.type;

  const submitterLabel =
      report.submittedBy === "security" ? "security" : "a concordian";

  return (
      <View
          style={[
            styles.updateCard,
            {
              borderLeftColor:
                  buildingColorMap[normalizeBuildingId(report.building)] ?? "#DDE3EA",
            },
          ]}
      >
        <View style={styles.updateCardInner}>
          <View style={styles.updateCardLeft}>
            <Text style={styles.updateEventTitle}>
              {report.name || report.type}
            </Text>

            {report.isSevere && (
                <View style={styles.severeIndicator}>
                  <TriangleAlert size={13} color="#F59E0B" />
                  <Text style={styles.severeIndicatorText}>
                    Marked Severe by Security
                  </Text>
                </View>
            )}

            {report.isResolved && report.timeline && (
                <Text style={styles.resolvedMeta}>
                  Resolved at{" "}
                  {report.timeline.find((e) => e.action === "resolved")?.time ??
                      "unknown"}
                </Text>
            )}

            <View style={styles.updateTypeRow}>
              <Icon name={typeIcon} size={16} color="#276389" />
              <Text style={styles.updateTypeLabel}>{typeLabel}</Text>
            </View>

            <View style={styles.updateMetaRow}>
              <Clock size={13} color="#5A6B80" />
              <Text style={styles.updateMeta}>{report.time}</Text>
            </View>

            <View style={styles.updateMetaRow}>
              <Building2 size={13} color="#5A6B80" />
              <Text style={styles.updateMeta}>
                {report.building} · Floor {report.floor}
              </Text>
            </View>

            <View style={styles.updateReporterRow}>
              <Text style={styles.updateMeta}>Reported by {submitterLabel}</Text>

              {report.isVerifiedBySecurity && (
                  <View style={styles.verifiedBadge}>
                    <Icon name="check-circle" size={13} color="#1FA64A" />
                    <Text style={styles.verifiedText}>Verified by Security</Text>
                  </View>
              )}
            </View>

            {currentUserRole === "security" && !report.isResolved && (
                <View style={styles.securityActionsRow}>
                  {onVerify && (
                      <TouchableOpacity
                          onPress={() => onVerify(report.id)}
                          style={[
                            styles.securityActionButton,
                            hasVerified && styles.securityActionButtonActive,
                          ]}
                      >
                        <CheckCircle
                            size={13}
                            color={hasVerified ? "#FFFFFF" : "#1FA64A"}
                        />
                        <Text
                            style={[
                              styles.securityActionText,
                              hasVerified && styles.securityActionTextActive,
                            ]}
                        >
                          {hasVerified ? "Undo Verify" : "Verify"}
                        </Text>
                      </TouchableOpacity>
                  )}

                  {onMarkSevere && (
                      <TouchableOpacity
                          onPress={() => onMarkSevere(report.id)}
                          style={[
                            styles.securityActionButton,
                            hasMarkedSevere && styles.securitySevereButtonActive,
                          ]}
                      >
                        <TriangleAlert
                            size={13}
                            color={hasMarkedSevere ? "#FFFFFF" : "#F59E0B"}
                        />
                        <Text
                            style={[
                              styles.securityActionText,
                              hasMarkedSevere && styles.securityActionTextActive,
                            ]}
                        >
                          {hasMarkedSevere ? "Undo Severe" : "Mark Severe"}
                        </Text>
                      </TouchableOpacity>
                  )}
                </View>
            )}
          </View>

          <View style={styles.updateCardActions}>
            <TouchableOpacity
                style={[
                  styles.actionButton,
                  isDisabled && styles.actionButtonDisabled,
                  hasUpvoted && styles.actionButtonUpvoted,
                ]}
                onPress={() => onUpvote(report.id)}
                disabled={isDisabled}
            >
              <ThumbsUp size={18} color={isDisabled ? "#aaa" : "#276389"} />
              <Text
                  style={[
                    styles.actionCount,
                    isDisabled && styles.actionCountDisabled,
                  ]}
              >
                {report.upvotedBy?.length ?? 0}
              </Text>
              <Text
                  style={[
                    styles.actionHelper,
                    isDisabled && styles.actionHelperDisabled,
                  ]}
              >
                {hasUpvoted ? "Liked" : "Like"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                  styles.actionButton,
                  isDisabled && styles.actionButtonDisabled,
                  hasResolved && styles.actionButtonUpvoted,
                ]}
                onPress={() => onResolve(report.id)}
                disabled={isDisabled}
            >
              <CheckCircle size={18} color={isDisabled ? "#aaa" : "#276389"} />
              <Text
                  style={[
                    styles.actionCount,
                    isDisabled && styles.actionCountDisabled,
                  ]}
              >
                {report.resolvedBy?.length ?? 0}
              </Text>
              <Text
                  style={[
                    styles.actionHelper,
                    isDisabled && styles.actionHelperDisabled,
                  ]}
              >
                {hasResolved ? "Undo" : "Resolve"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
            style={styles.chevronButton}
            onPress={() => onChevronPress(report)}
        >
          <Icon name="expand-more" size={24} color="#276389" />
        </TouchableOpacity>
      </View>
  );
}