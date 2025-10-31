<?php
// ✅ Return JSON responses
header("Content-Type: application/json");

// ✅ Allowed frontend origins
$allowedOrigins = [
    "http://localhost:5173",     // Local Vite dev server
    "http://localhost:3000",     // Local React dev server
    "https://amine-leagueOflegends-chatbot.netlify.app", // 🔹 replace with your Netlify domain
    "https://chatbot.wuaze.com"  // Your hosted backend (if used directly)
];

// ✅ Handle CORS dynamically
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ✅ Handle OPTIONS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ✅ Load API key
$envPath = __DIR__ . '/.env'; // Path to .env file in the same directory
if (!file_exists($envPath)) {
    http_response_code(500);
    echo json_encode(["error" => "Missing .env file"]);
    exit;
}

$env = parse_ini_file($envPath);
$apiKey = $env['OPENROUTER_API_KEY'] ?? null;

if (!$apiKey) {
    http_response_code(500);
    echo json_encode(["error" => "Missing OPENROUTER_API_KEY in .env"]);
    exit;
}

// ✅ Parse incoming JSON
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['messages'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid request: missing 'messages'"]);
    exit;
}

// ✅ Prepare and send request to OpenRouter
$payload = [
    "model" => "gpt-3.5-turbo", // You can change this model
    "messages" => $input['messages']
];

$ch = curl_init("https://openrouter.ai/api/v1/chat/completions");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer $apiKey"
    ],
    CURLOPT_POSTFIELDS => json_encode($payload)
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(["error" => curl_error($ch)]);
    curl_close($ch);
    exit;
}

$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// ✅ Return OpenRouter response or error
http_response_code($status);
echo $response;
?>
