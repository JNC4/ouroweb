let ctx = c.getContext('2d')

            let sentence = "Your sentence here";
            let characterCount = sentence.replace(/\s/g, "").length;
            let men = [];
            for (let i = 0; i < characterCount; i++) {
                men.push(new Man(/* Initial position */));
        }

            let canvasWidth = c.width;
            let canvasHeight = c.height;
            let positions = calculatePositions(characterCount, canvasWidth, canvasHeight);

            men.forEach((man, idx) => {
                man.walkTo(positions[idx]);
                man.holdUpArms();
            });

            men.forEach((man, idx) => {
                let letter = sentence.replace(/\s/g, "").charAt(idx);
                man.displayLetter(letter);
            });

            const people = 200
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

                    this.leg = random(scale / 3, scale * 2)
                    this.arm = random(scale / 3, this.body_h / 2 + this.leg / 2)

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
                walkTo(position) {
                    const speed = 1; // Adjust the speed as needed
                    const dx = position.x - this.x;
                    const dy = position.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const vx = (dx / distance) * speed;
                    const vy = (dy / distance) * speed;
                    this.x += vx;
                    this.y += vy;
                    if (Math.abs(this.x - position.x) < speed && Math.abs(this.y - position.y) < speed) {
                        this.x = position.x;
                        this.y = position.y;
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
                            ctx.fillStyle = '#000'
                            fillRect(
                            this.x + (this.arm_w / 2 + this.w / 2) * value,
                            this.offset_y + this.y + this.arm / 2,
                            this.arm_w,
                            this.appendage ? this.arm_w : this.arm)
                        }
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
                    reactions()
                    const movement = _ => {
                        this.move_timer --

                        if (this.move_timer == 0) {
                            const value = random(0, 3)

                            if (value) this.new_direction = random(-1, 2)
                            else this.new_direction = 0
                        }

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

                    if (this.direction != 0) {
                        this.offset_y += Math.cos(time * 20 / this.leg * scale / 10) * this.leg / 50
                        this.x += (scale / 20 + this.leg / 99) * this.direction
                    }
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

            let men = []

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
                c.width = cw = innerWidth
                c.height = ch = innerHeight

                scale = (cw + ch) / 72

                reset()

                men = []

                for (let i = 0; i < people; i ++) men.push(new Man(-scale / 2, ch / 2 + Math.sin(i*i) * ch / 2))
                men.sort((a, b) => (a.y + a.body_h / 2 + a.leg) - (b.y + b.body_h / 2 + b.leg))
            }

            function start() {
                addEventListener('resize', resize)
                resize()

                loop()
            }

            function loop() {
                ctx.clearRect(0, 0, c.width, c.height)
                time += .2

                men.forEach((man, idx) => {
                    man.update()

                    if (man.x > cw + scale / 2) man.x = -scale / 2
                    if (man.x < -scale / 2) man.x = cw + scale / 2
                })

                requestAnimationFrame(loop)
            }

            start()