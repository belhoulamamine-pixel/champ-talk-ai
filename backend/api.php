<?php
header("Access-Control-Allow-Origin: mohamedaminebelhoula.wuaze.com"); // or your domain instead of *
header("Content-Type: application/json");

// Load .env
$env = parse_ini_file(__DIR__ . '/.env');
$apiKey = $env['OPENAI_API_KEY'] ?? null;

if (!$apiKey) {
  echo json_encode(["error" => "API key not found"]);
  exit;
}

// Read input JSON
$input = json_decode(file_get_contents("php://input"), true);

// Send request to OpenAI
$url = "https://api.openai.com/v1/chat/completions";
$headers = [
  "Authorization: Bearer $apiKey",
  "Content-Type: application/json"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input));

$response = curl_exec($ch);
curl_close($ch);

echo $response;
