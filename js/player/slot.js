import Sprite   from '../base/sprite'
import DataBus  from '../databus'

const SLOT_IMG_SRC = 'images/Hole.png'
const SLOT_WIDTH   = 56
const SLOT_HEIGHT  = 56

const BLUE_IMG_SRC   = 'images/Kitty.png'
const RED_IMG_SRC    = 'images/Puppy.png'

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

export default class Slot extends Sprite {
  constructor() {
    super(SLOT_IMG_SRC, SLOT_WIDTH, SLOT_HEIGHT)

    this.contents = 0
  }

  blue()
  {
    super.updateSrc(BLUE_IMG_SRC)
  }
  red()
  {
    super.updateSrc(RED_IMG_SRC)
  }
  blank()
  {
    super.updateSrc(BULLET_IMG_SRC)
  }

  drop(turn)
  {
    super.drop(turn)
    this.contents = turn
  }


  getContents()
  {
    return this.contents
  }


  init(x, y, speed) {
    this.x = x
    this.y = y

    //this[__.speed] = speed

    this.visible = true
  }

  // 每一帧更新子弹位置
  update() {
    super.update()
   /* this.y -= this[__.speed]

    // 超出屏幕外回收自身
    if ( this.y < -this.height )
      databus.removeBullets(this)
    */
  }
}
