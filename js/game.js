class Game {
    constructor() {

    }
    getState() {
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function (data) {
            gameState = data.val();
        })

    }

    update(state) {
        database.ref('/').update({
            gameState: state
        });
    }
    async start() {
        Player.getPlayerInfo();
        if (gameState === 0) {
            player = new Player();
            var playerCountRef = await database.ref('playerCount').once("value");
            if (playerCountRef.exists()) {
                playerCount = playerCountRef.val();
                player.getCount();
            }
            form = new Form()
            form.display();
        }
        player1 = createSprite(200, 500);
        player1.addImage("player1", player_img);

        player2 = createSprite(800, 500);
        player2.addImage("player2", player_img);
        players = [player1, player2];

    }

    play() {

        form.hide();

        image(back_img, 0, 0, 1000, 800);
        var x = 100;
        var y = 200;
        var index = 0;
        drawSprites();
        for (var plr in allPlayers) {


            index = index + 1;
            x = 500 - allPlayers[plr].distance;
            y = 500;

            players[index - 1].x = x;
            players[index - 1].y = y;

            fill('black');
            stroke('white');
            strokeWeight(2);
            textAlign(CENTER);
            textSize(20);
            text(allPlayers[plr].name + "'s score: " + allPlayers[plr].score, x, y);
            
            if (index === player.index) {
                fill('green');
                noStroke();
                text("(YOU)", x, y + 25);
            }
        }

        if (keyIsDown(RIGHT_ARROW) && player.index !== null && player.distance > -450) {
            player.distance -= 10
            player.update();
        }
        if (keyIsDown(LEFT_ARROW) && player.index !== null && player.distance < 450) {
            player.distance += 10
            player.update();
        }

        if (frameCount % 20 === 0) {
            fruits = createSprite(random(100, 1000), 0, 100, 100);
            fruits.velocityY = 6;
            var rand = Math.round(random(1, 5));
            switch (rand) {
                case 1: fruits.addImage("fruit1", fruit1_img);
                    break;
                case 2: fruits.addImage("fruit1", fruit2_img);
                    break;
                case 3: fruits.addImage("fruit1", fruit3_img);
                    break;
                case 4: fruits.addImage("fruit1", fruit4_img);
                    break;
                case 5: fruits.addImage("fruit1", fruit5_img);
                    break;
            }
            fruitGroup.add(fruits);

        }

        if (player.index !== null) 
        {
            for (var i = 0; i < fruitGroup.length; i++) 
            {
                for (var p = 0; p < players.length; p++)
                {
                    if (fruitGroup.get(i).isTouching(players[p])) 
                    {
                        fruitGroup.get(i).destroy();
                        if (p == player.index - 1)
                        {
                            player.score++;
                            player.update();
                        }
    
                    }
                }

            }
        }

        var ranks = [];

        for (var p in allPlayers)
        {
            ranks.push(
                {
                    name: allPlayers[p].name,
                    score: allPlayers[p].score
                }
            );
        }

        ranks = ranks.sort((a, b) => 
        {
            return b.score-a.score;
        });

        var plrIndx = 0;
        textAlign(LEFT);
        fill('white');
        stroke('black');
        strokeWeight(5);
        for (var y = 50; y <= 100; y+= 50)
        {
            text((plrIndx + 1) + ". " + ranks[plrIndx].name + " - " + ranks[plrIndx].score, 50, y);
            plrIndx++;
        }
    }

    end() {
        console.log("Game Ended");
    }
}
