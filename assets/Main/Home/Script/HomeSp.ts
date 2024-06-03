import { _decorator, Button, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HomeSp')
export class HomeSp extends Component {
    /** 开始游戏按钮 */
    @property(Button) startGameButton: Button

    @property gameSceneName: string = 'GameScene'

    start() {
        this._preloadGameScene()
    }

    update(deltaTime: number) {

    }

    private _preloadGameScene() {
        director.preloadScene(this.gameSceneName, () => {
            console.log('预加载游戏场景成功')
        })
    }

    goToGameScene() {
        director.loadScene(this.gameSceneName)
    }
}

