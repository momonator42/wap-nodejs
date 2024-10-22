### User Story: Verwaltung der Socket-Verbindungen mit Redis-Integration

#### Titel:
Als Entwickler möchte ich eine Klasse zur Verwaltung von `socket.io`-Verbindungen mit Redis-Integration haben, um die Echtzeitkommunikation effizient und sicher vom Express-Server zu trennen und um Änderungen in Redis an die Benutzer zu kommunizieren.

#### Akzeptanzkriterien:
1. **Trennung der Socket-Verwaltung vom Express-Server:**
   - Die Klasse muss die `socket.io`-Verbindung unabhängig vom Express-Server verwalten können.
   - Die Verbindung soll über eine Initialisierungsmethode hergestellt werden, die nur die relevanten Abhängigkeiten für die Socket-Verwaltung benötigt.

2. **Initialisierung mit Argumenten:**
   - Die Klasse soll bei der Initialisierung folgende Parameter entgegennehmen:
     - `connection`: Die `socket.io`-Verbindung des Benutzers.
     - `redisClient`: Eine Redis-Client-Instanz zur Überwachung von Datenbankänderungen.
     - `sessionKey`: Der Schlüssel, der die aktuelle Sitzung des Benutzers in Redis repräsentiert.
     - `applicationKey`: Ein Schlüssel, dessen Änderungen überwacht werden sollen, um Benachrichtigungen an den Benutzer zu senden.

3. **Echtzeit-Benachrichtigungen bei Schlüsseländerungen in Redis:**
   - Die Klasse soll die Pub/Sub-Funktionalität von Redis nutzen, um Änderungen am `applicationKey` zu überwachen:
     - Die Klasse abonniert (subscribe) Redis-Kanäle oder Schlüssel-Muster, die für die `applicationKey`-Änderungen relevant sind.
     - Wenn eine Änderung im Wert des `applicationKey` stattfindet (z. B. durch `SET` oder `EXPIRE`), empfängt der Redis-Client eine Nachricht.
     - Die Nachricht wird von der Klasse verarbeitet, und der neue Wert des `applicationKey` wird extrahiert.
     - Die Klasse sendet eine Benachrichtigung über die `socket.io`-Verbindung an den Benutzer, die den neuen Inhalt des `applicationKey` enthält.
   - Beispiel für die Redis-Integration:
     - Nutzung von `redisClient.subscribe('channel_name')` für den Kanal, der Änderungen des `applicationKey` überwacht.
     - Auf den `message`-Event hören, um Benachrichtigungen zu erhalten und entsprechend über `socket.io` an den Benutzer weiterzuleiten.

4. **Verbindungsschluss bei Ablauf des Session Keys:**
   - Die Klasse soll den Ablauf des `sessionKey` überwachen:
     - Verwenden von Redis-Befehlen wie `EXPIRE` oder `TTL`, um die verbleibende Gültigkeitsdauer des `sessionKey` zu überprüfen.
     - Wenn der `sessionKey` abläuft oder entfernt wird, löst Redis eine Benachrichtigung aus, die von der Klasse erkannt wird.
     - Die Klasse schließt daraufhin die `socket.io`-Verbindung zum Benutzer mit einer entsprechenden Nachricht.
   - Beispiel für die Überwachung:
     - Abonnieren des Schlüsselereignisses mit `redisClient.psubscribe('__keyevent@0__:expired', 'session:*')` (angepasst für die spezifischen Schlüssel).
     - Über den `pmessage`-Event erkennen, wenn ein `sessionKey` abläuft, und die Verbindung schließen.

5. **Fehlerbehandlung und Wiederherstellungsmechanismen:**
   - Die Klasse muss robust gegen Redis-Ausfälle und Verbindungsabbrüche sein.
   - Bei Redis-Ausfällen soll die Klasse versuchen, die Verbindung zum Redis-Server automatisch wiederherzustellen.
   - Es soll eine Logik implementiert werden, um den Benutzer bei schwerwiegenden Fehlern oder bei einer nicht erfolgreichen Wiederherstellung zu informieren.

6. **Erweiterbarkeit und Anpassungsfähigkeit:**
   - Die Klasse soll leicht erweiterbar sein, um zukünftige Anforderungen zu unterstützen, z.B. das Hinzufügen neuer Schlüsselüberwachungen oder die Integration zusätzlicher Echtzeit-Funktionen.
   - Konfigurationsmöglichkeiten sollen durch Parameter oder eine Konfigurationsdatei bereitgestellt werden, um die Klasse flexibel an unterschiedliche Szenarien anzupassen.

#### Beschreibung:
**Als** Entwickler eines Echtzeit-Websystems **möchte ich** eine Klasse zur Verwaltung von `socket.io`-Verbindungen erstellen, die unabhängig vom Express-Server arbeitet und Redis zur Schlüsselüberwachung und Sitzungsverwaltung verwendet. **Dadurch möchte ich** die Serverlogik vereinfachen, eine klare Trennung der Zuständigkeiten erreichen und die Echtzeitkommunikation sicherer und effizienter gestalten.

Die Klasse soll `socket.io`-Verbindungen herstellen, die Änderung von spezifischen Schlüsseln in Redis überwachen und Benachrichtigungen über Änderungen direkt an den Benutzer senden. Bei Ablauf oder Entfernung eines Sitzungsschlüssels soll die Verbindung geschlossen werden, um sicherzustellen, dass nur aktive und gültige Sitzungen bestehen bleiben.

#### Implementierung der Redis-Benachrichtigung:
- **Schlüsselüberwachung:** Die Klasse abonniert spezifische Redis-Kanäle oder verwendet `PSUBSCRIBE`, um Änderungen an relevanten Schlüsseln (z. B. `applicationKey`) zu verfolgen.
- **Pub/Sub-Integration:**
  - Redis bietet Pub/Sub-Muster, die es ermöglichen, auf Nachrichten zu hören, die an bestimmte Kanäle gesendet werden. Diese Nachrichten können Änderungen von Schlüsseln signalisieren.
  - Die Klasse verwendet `redisClient.subscribe('channel_name')` oder `redisClient.psubscribe('keyevent:*')`, um Nachrichten zu abonnieren.
- **Benachrichtigungsversand:**
  - Wenn eine Änderung erkannt wird (z. B. über `message`-Event bei einem Schlüssel, der abonniert wurde), wird der neue Wert des Schlüssels durch die Klasse verarbeitet.
  - Eine Benachrichtigung wird über die `socket.io`-Verbindung an den Benutzer gesendet, um den Echtzeitcharakter der Kommunikation zu gewährleisten.

#### Vorteile:
- **Modularität:** Die Socket-Logik ist von der restlichen Applikation getrennt, was Wartung und Erweiterungen erleichtert.
- **Sicherheit:** Sitzungen und Schlüssel werden sicher überwacht und gehandhabt, um unberechtigte Zugriffe zu verhindern.
- **Echtzeit:** Änderungen werden sofort an die Benutzer weitergegeben, was die Nutzererfahrung verbessert.
- **Fehlerresistenz:** Robustheit gegen Ausfälle und Probleme, um eine stabile Verbindung sicherzustellen.

Diese Klasse stellt sicher, dass die Verwaltung von WebSocket-Verbindungen unabhängig und effizient erfolgt, während Sicherheits- und Echtzeitanforderungen erfüllt werden. Die Redis-Integration ermöglicht eine robuste und reaktive Echtzeitkommunikation mit den Benutzern.
