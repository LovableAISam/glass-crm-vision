export default function reverseDirection(oldDirection: "asc" | "desc"): "asc" | "desc" {
    return oldDirection === "asc" ? "desc" : "asc";
}