import com.burdbrain.drawings.DrawingWideBB;
import com.burdbrain.frames.ArtFrame;

class ShowFrame {

    public static void main(String args[]) {
        ArtFrame artFrame = new ArtFrame(new DrawingWideBB());

        artFrame.setSize(200, 100);
        artFrame.setVisible(true);
    }
}
