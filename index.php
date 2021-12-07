<?
error_reporting(-1);
header('Content-Type: text/html; charset=utf-8');

if (!isset($_GET['ACCESS']) || $_GET['ACCESS'] != 'GRANTED') {
    echo 'Доступ закрыт';
    die;
}

$dir  = 'tracks';
$filesPath = $_SERVER['HTTP_X_FORWARDED_PROTO'].'://'.$_SERVER['HTTP_HOST'].'/'.$dir.'/';
$files = scandir($dir);
unset($files[0]);
unset($files[1]);
$clientIP = $_SERVER['REMOTE_ADDR'];
?>

<!doctype html>
<html lang="ru">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>audio.aurori-align.ru: удобное прослушивание аудиокниг</title>

    <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
    <link rel="icon" type="image/x-icon" href="favicon/favicon.ico">
    <link rel="manifest" href="favicon/site.webmanifest">
    <link rel="mask-icon" href="favicon/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
    <link rel="stylesheet" href="css/style.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js" integrity="sha512-3j3VU6WC5rPQB4Ld1jnLV7Kd5xr+cq9avvhwqzbH/taCRNURoeEpoPBK9pDyeukwSxwRPJ8fDgvYXd6SkaZ2TA==" crossorigin="anonymous" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js" integrity="sha512-6+YN/9o9BWrk6wSfGxQGpt3EUK6XeHi6yeHV+TYD2GR0Sj/cggRpXr1BrAQf0as6XslxomMUxXp2vIl+fv0QRA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="js/script.js" defer></script>
</head>
<body>
    <main class="main">
        <section class="main__section">
            <div class="main__list player-list">
                <ul class="player-list__list">
                    <?foreach ($files as $file):
                        $file = iconv('cp1251', 'utf-8', $file);
                        $fileArray = explode('@', $file);
                        $fileNumber = $fileArray[0];
                        $fileName = $fileArray[1];
                    ?>
                        <li class="player-list__item">
                            <a class="player-list__item-link" href="<?=$filesPath.$file?>" data-number="<?=$fileNumber?>"><?=$fileName?></a>
                        </li>
                    <?endforeach?>
                </ul>
            </div>
            <div class="main_controls controls">
                <div class="controls__text-box">
                    <p class="controls__text">Выберите аудиодорожку</p>
                </div>
                <audio class="controls__audio" controls="" src="" data-number="" data-cookie=""></audio>
                <div class="controls__form">
                    <input class="controls__input" type="text" placeholder="Время последней паузы" value="">
                    <button class="controls__reset">Сбросить</button>
                </div>
            </div>
        </section>
    </main>

    <script>let clientIP = '<?=$clientIP?>'</script>
</body>
</html>