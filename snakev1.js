$(document).ready(function () {
    

    // Draw the canvas
    paint();
});

// Añadimos los controles del teclado
// incluyendo una cláusula que impida ir "en sentido contrario"
$(document).keydown(function (e) {
    var key = e.which;
    if (key == "37" && d != "right") d = "left";
    else if (key == "38" && d != "down") d = "up";
    else if (key == "39" && d != "left") d = "right";
    else if (key == "40" && d != "up") d = "down";
    // La serpiente ahora se puede controlar por teclado
})

function create_snake() {
    var length = 5; // Tamaño de la serpiente
    snake_array = []; //Inicializar el array vacío
    for (var i = length - 1; i >= 0; i--) {
        // Esto creará una serpiente horizontal
        // empezando en la esquina superior izquierda
        snake_array.push({ x: i, y: 0 });
    }
}

function paint() {
    // Initializa Canvas
    var canvas = $("#canvas")[0]; // The canvas variable contains our <canvas> element
    var ctx = canvas.getContext("2d"); // We initialize the 2D context of canvas in ctx
    var w = $("#canvas").width(); // We save width and height
    var h = $("#canvas").height();
    var cw = 10; // El tamaño de las celdas será de 10 px
    var score;
    
    // Dibujar el canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    // -- Movimiento de la serpiente --
    // La lógica es simple: quitar la cola del final y traerla al frente

    var nx = snake_array[0].x; // Guardamos la posición de la cabeza de la serpiente en nx y ny
    var ny = snake_array[0].y;

    nx++; // Incrementamos esos valores para obtener la nueva posición de la cabeza

    // If the new position of the head it's the same as the food
    // We create a new head instead of moving the tail
    if (nx == food.x && ny == food.y) {
        var tail = { x: nx, y: ny };
        score++;
        // Create new food
        create_food();
    }
    else {
        var tail = snake_array.pop(); // Pop and store the tail
        tail.x = nx; tail.y = ny; // Assign the tail the position of the head
    }
    // The snake has "eaten" the new cell

    snake_array.unshift(tail); // And now we insert the tail in the first position

    // Pintamos la serpiente
    for (var i = 0; i < snake_array.length; i++) {
        var c = snake_array[i];
        ctx.fillStyle = "red";
        ctx.fillRect(c.x * cw, c.y * cw, cw, cw);
        ctx.strokeStyle = "white";
        ctx.strokeRect(c.x * cw, c.y * cw, cw, cw);
    }

    var d = "right"; // Dirección del movimiento, por defecto a la derecha

    // Modificamos esos valores en función de la dirección que tiene la serpiente
    if (d == "right") nx++;
    else if (d == "left") nx--;
    else if (d == "up") ny--;
    else if (d == "down") ny++;

    tail.x = nx; tail.y = ny; // Asignamos a la cola la posición de la cabeza

    // Paint the snake
    for (var i = 0; i < snake_array.length; i++) {
        var c = snake_array[i];
        paint_cell(c.x, c.y);
    }

    var score_text = "Score: " + score;
    ctx.fillText(score_text, 5, h - 5);

    // End game conditions
    // Restart the game if it's outside the plane
    if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || check_collision(nx, ny, snake_array)) {
        // Restart game
        init();

        return;
    }
}

function check_collision(x, y, array) {
    // Check if x and y coordinates exists in a cells array
    for (var i = 0; i < array.length; i++) {
        if (array[i].x == x && array[i].y == y)
            return true;
    }
    return false;
}

function init() {
    d = "right"; // Direction of the movement. By default right
    create_snake();
    create_food();

    score = 0;

    // To move the snake we use a timer that will call the
    // paint() function every 60ms
    if (typeof game_loop != "undefined")
        clearInterval(game_loop);
    game_loop = setInterval(paint, 60);
}

function create_food() {
    food = {
        x: Math.random() * (w - cw) / cw,
        y: Math.random() * (h - cw) / cw,
    };
    // This will create a cell (food{}) with x and y values
    // and it will create it between 0 and w-cw or h-cw, meaning inside the plane
}

function paint_cell(x, y) {
    ctx.fillStyle = "blue";
    ctx.fillRect(x * cw, y * cw, cw, cw);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x * cw, y * cw, cw, cw);
}