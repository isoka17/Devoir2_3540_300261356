<?php
session_start();

header('Content-Type: application/json; charset=utf-8');

// Initialise le jeu si ce n'est pas déjà fait
if (!isset($_SESSION['tic_tac_toe'])) {
    $_SESSION['tic_tac_toe'] = [
        'board' => array_fill(0, 9, null),
        'currentPlayer' => 'X',
        'scores' => ['X' => 0, 'O' => 0],
        'drawCount' => 0
    ];
}

// Lit les données JSON envoyées par le client
$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

function checkWin($board, $player) {
    $winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    foreach ($winningCombos as $combo) {
        if ($board[$combo[0]] === $player && $board[$combo[1]] === $player && $board[$combo[2]] === $player) {
            return true;
        }
    }
    return false;
}

function isBoardFull($board) {
    return !in_array(null, $board);
}

if ($action === 'move') {
    $cellIndex = $data['cellIndex'];
    $playerSymbol = $data['playerSymbol']; // Utilisez playerSymbol au lieu de currentPlayer pour la cohérence avec le JS

    if ($_SESSION['tic_tac_toe']['board'][$cellIndex] === null) {
        $_SESSION['tic_tac_toe']['board'][$cellIndex] = $playerSymbol;

        if (checkWin($_SESSION['tic_tac_toe']['board'], $playerSymbol)) {
            $_SESSION['tic_tac_toe']['scores'][$playerSymbol]++;
            $response = ['winner' => $playerSymbol, 'newScore' => $_SESSION['tic_tac_toe']['scores'][$playerSymbol]];
        } elseif (isBoardFull($_SESSION['tic_tac_toe']['board'])) {
            $_SESSION['tic_tac_toe']['drawCount']++;
            $response = ['draw' => true];
        } else {
            $_SESSION['tic_tac_toe']['currentPlayer'] = $playerSymbol === 'X' ? 'O' : 'X';
            $response = ['nextPlayer' => $_SESSION['tic_tac_toe']['currentPlayer']];
        }
    } else {
        $response = ['error' => 'Invalid move'];
    }
} elseif ($action === 'reset') {
    $_SESSION['tic_tac_toe']['board'] = array_fill(0, 9, null);
    $_SESSION['tic_tac_toe']['currentPlayer'] = 'X';
    $response = ['message' => 'Game reset'];
} else {
    $response = ['error' => 'No action specified'];
}

echo json_encode($response);
?>
