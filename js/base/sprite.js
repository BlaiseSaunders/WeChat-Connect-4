/**
 * 游戏基础的精灵类
 */



export default class Sprite {
  constructor(imgSrc = '', width=  0, height = 0, x = 0, y = 0) {
    this.img     = new Image()
    this.img.src = imgSrc
    this.token = new Image()


    this.tokenx = x
    this.tokeny = 0
    this.tokenya = 0

    this.width  = width
    this.height = height

    this.dropped = false

    this.x = x
    this.y = y

    this.visible = true
  }

  updateSrc(newsrc)
  {
    this.img = new Image()
    this.img.src = newsrc
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if ( !this.visible )
      return

    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
    ctx.drawImage(
      this.token,
      this.tokenx,
      this.tokeny,
      this.width,
      this.height
    )
  }

  drop(player)
  {
    console.log("Dropping in a token for player "+player)
    if (player == 1)
      this.token.src = 'images/Kitty.png'
    if (player == 2)
      this.token.src = 'images/Puppy.png'


      this.dropped = true
  }

  update()
  {
    this.tokenx = this.x
    
    //console.log(this.tokeny)
    if (this.tokeny >= this.y || this.dropped == false)
    {
      return
    }
    else
    {
      this.tokenya += 0.8;
      this.tokeny += this.tokenya
      if (this.tokeny > this.y)
        this.tokeny = this.y
    }
  }

  /**
   * 简单的碰撞检测定义：
   * 另一个精灵的中心点处于本精灵所在的矩形内即可
   * @param{Sprite} sp: Sptite的实例
   */
  isCollideWith(sp) {
    let spX = sp.x + sp.width / 2
    let spY = sp.y + sp.height / 2

    if ( !this.visible || !sp.visible )
      return false

    return !!(   spX >= this.x
              && spX <= this.x + this.width
              && spY >= this.y
              && spY <= this.y + this.height  )
  }
}
