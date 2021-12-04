<?
if (!isset($_GET['ACCESS']) || $_GET['ACCESS'] != 'GRANTED') {
    echo 'Доступ закрыт';
    die;
}

$dir  = 'tracks';
$filesPath = $_SERVER['HTTP_X_FORWARDED_PROTO'].'://'.$_SERVER['HTTP_HOST'].'/'.$dir.'/';
$files = scandir($dir);
unset($files[0]);
unset($files[1]);
$IP = $_SERVER['REMOTE_ADDR'];
?>

<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>audio.aurori-align.ru: удобное прослушивание аудиокниг</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
    <link rel="stylesheet" href="style.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js" integrity="sha512-3j3VU6WC5rPQB4Ld1jnLV7Kd5xr+cq9avvhwqzbH/taCRNURoeEpoPBK9pDyeukwSxwRPJ8fDgvYXd6SkaZ2TA==" crossorigin="anonymous" defer></script>
    <script src="script.js" defer></script>
</head>
<body>
    <main>
        <section class="main">
            <div class="main__list player-list">
                <ul class="player-list__list">
                    <?foreach ($files as $file):
                        $fileArray = explode('#', $file);
                        $fileNumber = $fileArray[0];
                        $fileName = $fileArray[1];
                    ?>
                        <li class="player-list__item">
                            <a href="<?=$filesPath.$file?>" data-number="<?=$fileNumber?>"><?=$fileName?></a>
                        </li>
                    <?endforeach?>
                </ul>
            </div>
            <div class="main_controls controls">
                <input class="controls__input" type="text" value="">
                <button class="controls__reset">Сбросить</button>
            </div>
        </section>
    </main>
</body>
</html>