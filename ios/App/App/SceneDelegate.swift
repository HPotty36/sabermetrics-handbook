import UIKit
import Capacitor
import WebKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = MainViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}

/// 웹뷰에서 화면 왼쪽 가장자리를 밀면 이전 페이지로, 오른쪽 가장자리를 밀면 다음 페이지로 간다(Safari와 같은 제스처).
/// WKWebView는 기본으로 꺼져 있어서 켠다.
class MainViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        super.capacitorDidLoad()
        webView?.allowsBackForwardNavigationGestures = true
    }

    /// iPad에서 스테이지 매니저를 켜면 왼쪽 가장자리 밀기를 시스템(최근 앱)이 먼저 가져가서 뒤로 밀기가 되지 않는다(WebKit 버그 247084).
    /// Safari처럼 첫 밀기는 앱이 받고, 시스템 제스처는 한 번 더 밀거나 가장자리에 나오는 화살표로 쓰게 한다.
    override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge {
        .left
    }
}
