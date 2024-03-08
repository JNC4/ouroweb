
let c = document.getElementById('c');
let ctx = c.getContext('2d')
            function random(min, max) {
            return Math.random() * (max - min) + min;
}
function calculatePositions(numCharacters, canvasWidth, canvasHeight) {
    let positions = [];
    for (let i = 0; i < numCharacters; i++) {
        // Calculate the position for the character
        let position = {
            x: canvasWidth / numCharacters * i,
            y: canvasHeight / 2
        };

        // Add the position to the array of positions
        positions.push(position);
    }
    return positions;
}

            let sentence = "Happy 6 month anniversary"; // replace with your sentence
            let numCharacters = sentence.replace(/\s/g, "").length;

            let canvasWidth = c.width;
            let canvasHeight = c.height;
            let positions = calculatePositions(numCharacters, canvasWidth, canvasHeight);

            let time = 0
            let scale = cw = ch = 0

            class Man {
                constructor(x, y) {
                    this.x = x
                    this.y = y
                    this.armsUp = false;
                    this.letter = '';
                    this.posterColor = '#fff';
                    this.posterSize = scale;
                    this.posterPadding = 5; //
                    this.body_h = random(scale / 2, scale * 2)
                    this.head_y = this.y - this.body_h / 2;
                    this.leg = random(scale / 3, scale * 2)
                    this.arm = random(scale / 3, this.body_h / 2 + this.leg / 2)
                    this.armY = this.y + this.arm; // arm's y position when down

                    this.appendage = random(0, 2)

                    this.eye_dist = random(.7, 1.5, 0)
                    this.leg_dist = random(.2, .8, 0)

                    const color = random(0, 3) // priority color

                    this.color = rgb(
                        random(!color?150:0,!color?255:150),
                        random(color==1?150:0,color==1?255:150),
                        random(color==2?150:0,color==2?255:150)
                    )

                    this.eyes = (this.w > this.body_h ? this.body_h / 3 : this.w / 3)
                    this.pupils = this.w > this.body_h ? this.body_h / 7 : this.w / 7
                    this.dist = (this.eyes - this.pupils) / 2

                    this.y += -this.body_h / 2 - this.leg
                }
                drawSquare(letter) {
                    const squareSize = 30; // Adjust the size as needed
                    const squareColor = '#fff'; // White color
                
                    // Draw the square
                    ctx.fillStyle = squareColor;
                    ctx.fillRect((this.x)-15, (this.armY - squareSize)-80, squareSize, squareSize);
                
                    // Draw the letter
                    if (typeof letter === 'string') {
                        ctx.fillStyle = '#000'; // Black color for the letter
                        ctx.font = '20px Arial'; // Adjust the font size and family as needed
                        ctx.fillText(letter, (this.x)-5, (this.armY - squareSize)-60); // Adjust the position as needed
                    }
                }
                holdUpArms() {
                    this.armY = this.head_y;
                    this.armsUp = true;
                }

    // Method to display a letter on a white poster
    displayLetter(letter) {
        this.letter = letter;
        // Draw the poster with the letter if arms are up and a letter is set
        if (this.armsUp && this.letter) {
            ctx.fillStyle = this.posterColor;
            ctx.fillRect(this.x, this.armY - this.posterSize, this.posterSize, this.posterSize);
    
            // Draw the letter inside the poster
            ctx.fillStyle = '#000';
            ctx.font = `${this.posterSize - this.posterPadding}px Arial`;
            ctx.fillText(this.letter, this.x + this.posterPadding / 2, this.armY - this.posterSize + this.posterSize - this.posterPadding / 2);
        }
    }

                update() {
                    const move = (start, end, speed) => {
                        const distance = end - start
                        return Math.abs(distance) < speed ? end : start + Math.sign(distance) * speed
                    }

                    const draw = _ => {
                        const body = _ => {
                            ctx.fillStyle = this.color
                            fillRect(this.x, this.offset_y + this.y, this.w, this.body_h)

                            ctx.fillStyle = '#0005'
                            fillRect(this.x, this.y + this.body_h / 2 + this.leg + this.leg_w / 4, (this.body_h + this.w) / 2, scale / 10)
                        }
                        
                        const eye = value => {
                            ctx.fillStyle = '#fff'
                            fillRect(
                            this.x + this.w / 4 * value,
                            this.offset_y + this.y - this.body_h / 4, this.eyes, this.eyes)

                            ctx.fillStyle = '#000'
                            fillRect(
                            this.eye_x * this.dist + this.x + this.w / 4 * value,
                            this.offset_y + this.eye_y * this.dist + this.y - this.body_h / 4, this.pupils, this.pupils)
                        }
                        const arm = value => {
                            ctx.fillStyle = '#000';
                            fillRect(
                                this.x + (this.arm_w / 2 + this.w / 2) * value,
                                this.armY -80,
                                this.arm_w,
                                this.appendage ? this.arm_w : this.arm
                            );
                        };
                        const leg = (x, y, height, value) => {
                            ctx.fillStyle = '#000'
                            fillRect(
                            x + this.x + this.w / 2 * value,
                            y + this.y + this.body_h / 2 + (this.appendage ? this.leg : this.leg / 2),
                            this.leg_w,
                            height + (this.appendage ? this.leg_w : this.leg))
                        }

                        if (this.direction != 0) {
                            if (this.appendage) {
                                this.speed += this.direction / this.leg * scale / 4

                                leg(Math.cos(this.speed) * this.leg / 4,
                                    Math.sin(this.speed) < 0 ? Math.sin(this.speed) * this.leg / 4 : 0, 0, 0)

                                leg(Math.cos(9.4 + this.speed) * this.leg / 4,
                                    Math.sin(9.4 + this.speed) < 0 ? Math.sin(9.4 + this.speed) * this.leg / 4 : 0, 0, 0)
                            }
                            else {
                                leg(0,
                                    this.offset_y - this.offset_y / 2 + Math.sin(time) * this.leg / 16,
                                    -this.offset_y + Math.sin(time) * this.leg / 8,
                                    this.leg_dist)
                                leg(0,
                                    this.offset_y - this.offset_y / 2 + Math.sin(.5 - time) * this.leg / 16,
                                    -this.offset_y + Math.sin(.5 - time) * this.leg / 8,
                                    -this.leg_dist)
                            }
                        }

                        else {
                            leg(0,0,0,this.leg_dist)
                            leg(0,0,0,-this.leg_dist)
                        }

                        body()
                        eye(this.eye_dist)
                        eye(-this.eye_dist)
                        arm(1)
                        arm(-1)
                    }
                    draw()
                    const reactions = _ => {
                        this.react_timer --

                        if (this.react_timer < 0 && !this.react) {
                            this.react = random(1, 10)

                            if (this.react <= 4) this.action = 1
                            else if (this.react <= 7) {
                                this.action = 2
                                this.eye_x_goal = random(-1, 1, 0)
                            }
                            else if (this.react <= 10) {
                                this.action = 3
                                this.eye_y_goal = random(-1, 1, 0)
                            }
                        }

                        if (this.action == 1) { // blink
                            const speed = this.react_timer / 5

                            let blink = Math.sin(speed) * this.eyes

                            ctx.fillStyle = this.color
                            fillRect(this.x, this.offset_y + this.y - this.body_h / 4 - blink / 2 - this.eyes / 2, this.w / 2 * this.eye_dist + this.eyes, blink)

                            if (blink - speed * 2 > Math.PI) {
                                this.react_timer = random(this.react_random.min, this.react_random.max)
                                this.react = 0
                                this.action = 0
                            }
                        }

                        if (this.action == 2) { // move eyes on x
                            this.eye_x = move(this.eye_x, this.eye_x_goal, .3)

                            if (this.eye_x == this.eye_x_goal) {
                                this.react_timer = random(this.react_random.min, this.react_random.max)
                                this.react = 0
                                this.action = 0
                            }
                        }

                        if (this.action == 3) { // move eyes on y
                            this.eye_y = move(this.eye_y, this.eye_y_goal, .3)

                            if (this.eye_y == this.eye_y_goal) {
                                this.react_timer = random(this.react_random.min, this.react_random.max)
                                this.react = 0
                                this.action = 0
                            }
                        }
                    }
                    reactions();
                    this.drawSquare();
                    const movement = _ => {
                        this.move_timer --
                    
                        if (this.move_timer < 0) {
                            this.offset_y = move(this.offset_y, 0, .1)
                            this.direction = move(this.direction, this.new_direction, .1)
                            if (this.new_direction) this.eye_x = move(this.eye_x, this.new_direction, .1)
                    
                            if (this.offset_y == 0 && this.direction == this.new_direction) {
                                this.move_timer = random(this.move_random.min, this.move_random.max)
                            }
                        }
                    }
                    movement()
                    this.drawSquare(sentence[this.position]);
                }
            }

            function reset() {
                Man.prototype.w = scale
                Man.prototype.arm_w = scale / 10
                Man.prototype.leg_w = scale / 7
            }

            reset()

            Man.prototype.eye_x = 1
            Man.prototype.eye_y = 0
            Man.prototype.eye_x_goal = 1
            Man.prototype.eye_y_goal = 0

            Man.prototype.react_timer = 0
            Man.prototype.react_random = {min: 0, max: 200}
            Man.prototype.react = 0
            Man.prototype.action = 0
            Man.prototype.direction = 0
            Man.prototype.new_direction = 0
            Man.prototype.speed = 0
            Man.prototype.offset_y = 0

            Man.prototype.move_timer = 0
            Man.prototype.move_random = {min: 20, max: 500}

            function random(min, max, int = 1) {
                const value = Math.random() * (max - min) + min

                return int ? Math.floor(value) : value
            }
            function rgb(r, g, b, a = 255) {
                return `rgba(${r}, ${g}, ${b}, ${a / 255})`
            }
            function fillRect(x, y, w, h) {
                ctx.fillRect(x - w / 2, y - h / 2, w, h)
            }

            function resize() {
                c.width = cw = innerWidth;
                c.height = ch = innerHeight;
                
                scale = (cw + ch) / 72;
                
                Man.prototype.posterSize = scale; // Set posterSize here
                
                reset();
            }
            function loop() {
                ctx.clearRect(0, 0, c.width, c.height)
                time += .2

                men.forEach((man, idx) => {
                    man.update()

                    if (man.x > cw + scale / 2) man.x = -scale / 2
                    if (man.x < -scale / 2) man.x = cw + scale / 2
                })
                let positions = calculatePositions(numCharacters, canvasWidth, canvasHeight);
                men.forEach((man, idx) => {
                    man.targetPosition = positions[idx];
    });
                requestAnimationFrame(loop)
            }

            function start() {
                addEventListener('resize', resize);
                resize();
                let sentence = "Happy 6 month anniversary";
                let numCharacters = sentence.length; // Include spaces
                let positions = calculatePositions(numCharacters, canvasWidth, canvasHeight);
                men = [];
                for (let i = 0; i < sentence.length; i++) {
                    // Check if the character at the current position is a space
                    if (sentence[i] !== ' ') {
                        // Create a new "man" object
                        let man = new Man(((positions[i].x)*4)+150, (positions[i].y)+350);
            
                        // Assign the "man" a position that corresponds to the position of the character in the sentence
                        man.position = i;
            
                        // Add the "man" to the array of men
                        men.push(man);
                    }
                }
            
                men.forEach((man, idx) => {
                    man.holdUpArms();
                });
            
                loop();
            }
            
            document.addEventListener('DOMContentLoaded', (event) => {
                document.getElementById('startButton').addEventListener('click', start);
            
                document.getElementById('goButton').addEventListener('click', function() {
                    // Remove the canvas, the start button and the script
                    document.getElementById('c').remove();
                    document.getElementById('startButton').remove();
                
                    // Load the image gallery
                    let gallery = document.createElement('div');
                    gallery.id = 'gallery';
                    document.body.appendChild(gallery);
                
                    // Fetch the list of image file names from the server
                    fetch('/api/images')
                        .then(response => response.json())
                        .then(images => {
                            // Loop through the image file names and create an img element for each one
                            images.forEach(image => {
                                let img = document.createElement('img');
                                img.src = "/ouroboros/static/zerepic6m/" + image;
                                gallery.appendChild(img);
                            });
                        });
                });
            });
