export default function stressScoreColor(stressScore) {
    if (stressScore > 10) {
        return "very-stressed";
    } else if (stressScore >= 7) {
        return "stressed";
    } else if (stressScore >= 5) {
        return "moderate";
    } else {
        return "good";
    }
}