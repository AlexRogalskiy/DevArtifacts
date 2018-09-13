import static java.lang.System.out;

class EnglishSpeakingWorld2 {
    String mars;

    void visitIdaho() {
        out.println("visitID is running:");

        mars = "   red planet";
        String atomicCity = "   Population: 25";

        out.println(mars);
        out.println(atomicCity);
    }

    void visitNewJersey() {
        out.println("visitNJ is running:");

        out.println(mars);
        //out.println(atomicCity);    cannot resolve symbol
    }
}
