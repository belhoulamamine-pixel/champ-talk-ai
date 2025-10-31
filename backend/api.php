<?php
header("Content-Type: application/json");

// ✅ CORS: allow all origins (safe because we don't use credentials)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With");
header("Access-Control-Max-Age: 86400");

// ✅ Short-circuit preflight requests
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ✅ Load API key from .env
$envPath = __DIR__ . '/.env';
$apiKey = null;

if (file_exists($envPath)) {
    $env = parse_ini_file($envPath, false, INI_SCANNER_RAW);
    $apiKey = $env['OPENROUTER_API_KEY'] ?? null;
}

if (!$apiKey) {
    http_response_code(500);
    echo json_encode(["error" => "API key not configured."]);
    exit;
}

// ✅ Read POSTed JSON
$input = json_decode(file_get_contents("php://input"), true);
if (!$input || !isset($input['messages'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid request"]);
    exit;
}

// ✅ Send request to OpenRouter
$ch = curl_init("https://openrouter.ai/api/v1/chat/completions");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer $apiKey"
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "model" => "gpt-3.5-turbo", // you can change the model
        "messages" => $input['messages']
    ])
]);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(["error" => curl_error($ch)]);
    curl_close($ch);
    exit;
}
curl_close($ch);

// ✅ Return OpenRouter response to frontend
echo $response;
?>
