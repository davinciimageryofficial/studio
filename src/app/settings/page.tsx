
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Briefcase, LogOut, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Language = 'en' | 'es' | 'zh' | 'sn' | 'fr' | 'de' | 'ja';

const translations: Record<Language, Record<string, string>> = {
    en: {
        settings: "Settings",
        manageAccount: "Manage your account and application preferences.",
        profile: "Profile",
        updateProfile: "Update your public profile information.",
        name: "Name",
        headline: "Headline",
        bio: "Bio",
        saveChanges: "Save Changes",
        verification: "Verification",
        verifyWork: "Verify your place of work to add credibility to your profile and posts.",
        currentPosition: "Current Verified Position",
        positionVerified: "Your position is verified and will be displayed on your profile.",
        verifyNewEmail: "Verify with a new work email",
        sendVerification: "Send Verification Email",
        account: "Account",
        manageAccountSettings: "Manage your account settings and display preferences.",
        email: "Email",
        changePassword: "Change Password",
        displayPreferences: "Display Preferences",
        showPositionOnPosts: "Show position on posts",
        showPositionDesc: "Display your verified job title and company next to your name on your posts.",
        appearance: "Appearance",
        appearanceDesc: "Customize the look and feel of the application.",
        logout: "Logout",
        langAndRegion: "Language & Region",
        langAndRegionDesc: "Choose the language and region for your Sentry experience.",
        language: "Language",
        languageDesc: "This will change the language of the user interface.",
        saveLanguage: "Save Language"
    },
    es: {
        settings: "Configuración",
        manageAccount: "Gestiona tu cuenta y las preferencias de la aplicación.",
        profile: "Perfil",
        updateProfile: "Actualiza la información de tu perfil público.",
        name: "Nombre",
        headline: "Titular",
        bio: "Biografía",
        saveChanges: "Guardar Cambios",
        verification: "Verificación",
        verifyWork: "Verifica tu lugar de trabajo para añadir credibilidad a tu perfil y publicaciones.",
        currentPosition: "Puesto Verificado Actual",
        positionVerified: "Tu puesto está verificado y se mostrará en tu perfil.",
        verifyNewEmail: "Verificar con un nuevo correo electrónico de trabajo",
        sendVerification: "Enviar Correo de Verificación",
        account: "Cuenta",
        manageAccountSettings: "Gestiona la configuración de tu cuenta y las preferencias de visualización.",
        email: "Correo Electrónico",
        changePassword: "Cambiar Contraseña",
        displayPreferences: "Preferencias de Visualización",
        showPositionOnPosts: "Mostrar puesto en las publicaciones",
        showPositionDesc: "Muestra tu puesto de trabajo y empresa verificados junto a tu nombre en tus publicaciones.",
        appearance: "Apariencia",
        appearanceDesc: "Personaliza el aspecto de la aplicación.",
        logout: "Cerrar Sesión",
        langAndRegion: "Idioma y Región",
        langAndRegionDesc: "Elige el idioma y la región para tu experiencia en Sentry.",
        language: "Idioma",
        languageDesc: "Esto cambiará el idioma de la interfaz de usuario.",
        saveLanguage: "Guardar Idioma"
    },
    zh: {
        settings: "设置",
        manageAccount: "管理您的帐户和应用程序首选项。",
        profile: "个人资料",
        updateProfile: "更新您的公开个人资料信息。",
        name: "姓名",
        headline: "标题",
        bio: "个人简介",
        saveChanges: "保存更改",
        verification: "验证",
        verifyWork: "验证您的工作地点，以增加您个人资料和帖子的可信度。",
        currentPosition: "当前已验证职位",
        positionVerified: "您的职位已通过验证，将显示在您的个人资料中。",
        verifyNewEmail: "使用新的工作电子邮件进行验证",
        sendVerification: "发送验证邮件",
        account: "帐户",
        manageAccountSettings: "管理您的帐户设置和显示首选项。",
        email: "电子邮件",
        changePassword: "更改密码",
        displayPreferences: "显示首选项",
        showPositionOnPosts: "在帖子上显示职位",
        showPositionDesc: "在您的帖子上的姓名旁边显示您已验证的职位和公司。",
        appearance: "外观",
        appearanceDesc: "自定义应用程序的外观和感觉。",
        logout: "登出",
        langAndRegion: "语言与地区",
        langAndRegionDesc: "为您的 Sentry 体验选择语言和地区。",
        language: "语言",
        languageDesc: "这将更改用户界面的语言。",
        saveLanguage: "保存语言"
    },
    sn: {
        settings: "Zvirongwa",
        manageAccount: "Chengetedza account yako nezvaunofarira paapplication.",
        profile: "Mbiri Yako",
        updateProfile: "Gadziridza ruzivo rwako rwembiri inoonekwa neruzhinji.",
        name: "Zita",
        headline: "Musoro Wenyaya",
        bio: "Nhoroondo Pfupi",
        saveChanges: "Chengetedza Shanduko",
        verification: "Kusimbisa",
        verifyWork: "Simbisa nzvimbo yako yebasa kuti uwedzere kuvimbika kune mbiri yako nezvaunotumira.",
        currentPosition: "Chigaro Chazvino Chakavimbiswa",
        positionVerified: "Chigaro chako chakasimbiswa uye chichaonekwa pambiri yako.",
        verifyNewEmail: "Simbisa neemail itsva yebasa",
        sendVerification: "Tumira Email Yekusimbisa",
        account: "Account",
        manageAccountSettings: "Chengetedza zvirongwa zveaccount yako nezvaunofarira pakuonekwa.",
        email: "Email",
        changePassword: "Chinja Password",
        displayPreferences: "Zvaunofarira Pakuonekwa",
        showPositionOnPosts: "Ratidza chigaro pane zvaunotumira",
        showPositionDesc: "Ratidza zita rako rebasa rakavimbiswa nekambani padivi pezita rako pane zvaunotumira.",
        appearance: "Maonekero",
        appearanceDesc: "Gadzirisa maonekero eapplication.",
        logout: "Buda",
        langAndRegion: "Mutauro neDunhu",
        langAndRegionDesc: "Sarudza mutauro nedunhu raunoda kushandisa paSentry.",
        language: "Mutauro",
        languageDesc: "Izvi zvinoshandura mutauro weiyo user interface.",
        saveLanguage: "Chengetedza Mutauro"
    },
    fr: {
        settings: "Paramètres",
        manageAccount: "Gérez votre compte et les préférences de l'application.",
        profile: "Profil",
        updateProfile: "Mettez à jour les informations de votre profil public.",
        name: "Nom",
        headline: "Titre",
        bio: "Biographie",
        saveChanges: "Enregistrer les modifications",
        verification: "Vérification",
        verifyWork: "Vérifiez votre lieu de travail pour ajouter de la crédibilité à votre profil et à vos publications.",
        currentPosition: "Poste actuel vérifié",
        positionVerified: "Votre poste est vérifié et sera affiché sur votre profil.",
        verifyNewEmail: "Vérifier avec une nouvelle adresse e-mail professionnelle",
        sendVerification: "Envoyer l'e-mail de vérification",
        account: "Compte",
        manageAccountSettings: "Gérez les paramètres de votre compte et vos préférences d'affichage.",
        email: "E-mail",
        changePassword: "Changer de mot de passe",
        displayPreferences: "Préférences d'affichage",
        showPositionOnPosts: "Afficher le poste sur les publications",
        showPositionDesc: "Affichez votre titre de poste et votre entreprise vérifiés à côté de votre nom sur vos publications.",
        appearance: "Apparence",
        appearanceDesc: "Personnalisez l'apparence de l'application.",
        logout: "Se déconnecter",
        langAndRegion: "Langue et région",
        langAndRegionDesc: "Choisissez la langue et la région pour votre expérience Sentry.",
        language: "Langue",
        languageDesc: "Cela changera la langue de l'interface utilisateur.",
        saveLanguage: "Enregistrer la langue"
    },
    de: {
        settings: "Einstellungen",
        manageAccount: "Verwalten Sie Ihr Konto und Ihre Anwendungseinstellungen.",
        profile: "Profil",
        updateProfile: "Aktualisieren Sie Ihre öffentlichen Profilinformationen.",
        name: "Name",
        headline: "Titel",
        bio: "Biografie",
        saveChanges: "Änderungen speichern",
        verification: "Verifizierung",
        verifyWork: "Verifizieren Sie Ihren Arbeitsplatz, um Ihrem Profil und Ihren Beiträgen Glaubwürdigkeit zu verleihen.",
        currentPosition: "Aktuell verifizierte Position",
        positionVerified: "Ihre Position ist verifiziert und wird in Ihrem Profil angezeigt.",
        verifyNewEmail: "Mit einer neuen geschäftlichen E-Mail-Adresse verifizieren",
        sendVerification: "Verifizierungs-E-Mail senden",
        account: "Konto",
        manageAccountSettings: "Verwalten Sie Ihre Kontoeinstellungen und Anzeigeeinstellungen.",
        email: "E-Mail",
        changePassword: "Passwort ändern",
        displayPreferences: "Anzeigeeinstellungen",
        showPositionOnPosts: "Position in Beiträgen anzeigen",
        showPositionDesc: "Zeigen Sie Ihren verifizierten Jobtitel und Ihr Unternehmen neben Ihrem Namen in Ihren Beiträgen an.",
        appearance: "Erscheinungsbild",
        appearanceDesc: "Passen Sie das Aussehen der Anwendung an.",
        logout: "Abmelden",
        langAndRegion: "Sprache & Region",
        langAndRegionDesc: "Wählen Sie die Sprache und Region für Ihr Sentry-Erlebnis.",
        language: "Sprache",
        languageDesc: "Dadurch wird die Sprache der Benutzeroberfläche geändert.",
        saveLanguage: "Sprache speichern"
    },
    ja: {
        settings: "設定",
        manageAccount: "アカウントとアプリケーションの設定を管理します。",
        profile: "プロフィール",
        updateProfile: "公開プロフィール情報を更新します。",
        name: "名前",
        headline: "見出し",
        bio: "経歴",
        saveChanges: "変更を保存",
        verification: "認証",
        verifyWork: "あなたのプロフィールと投稿に信頼性を加えるために、職場を認証してください。",
        currentPosition: "現在認証済みの役職",
        positionVerified: "あなたの役職は認証されており、プロフィールに表示されます。",
        verifyNewEmail: "新しい職場のメールアドレスで認証する",
        sendVerification: "認証メールを送信",
        account: "アカウント",
        manageAccountSettings: "アカウント設定と表示設定を管理します。",
        email: "メールアドレス",
        changePassword: "パスワードを変更",
        displayPreferences: "表示設定",
        showPositionOnPosts: "投稿に役職を表示",
        showPositionDesc: "投稿であなたの名前の隣に認証済みの役職と会社を表示します。",
        appearance: "外観",
        appearanceDesc: "アプリケーションの外観をカスタマイズします。",
        logout: "ログアウト",
        langAndRegion: "言語と地域",
        langAndRegionDesc: "Sentry体験の言語と地域を選択してください。",
        language: "言語",
        languageDesc: "これにより、ユーザーインターフェースの言語が変更されます。",
        saveLanguage: "言語を保存"
    }
};


export default function SettingsPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const t = translations[selectedLanguage];

  const handleLogout = () => {
    router.push('/logout');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t.settings}</h1>
        <p className="mt-1 text-muted-foreground">
          {t.manageAccount}
        </p>
      </header>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t.profile}</CardTitle>
            <CardDescription>{t.updateProfile}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t.name}</Label>
                <Input id="name" defaultValue="Christian Peta" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">{t.headline}</Label>
                <Input id="headline" defaultValue="Senior Frontend Developer | React & Next.js Expert" />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="bio">{t.bio}</Label>
                <textarea id="bio" className="w-full min-h-24 p-2 border rounded-md" defaultValue="Building performant and scalable web applications. I love TypeScript and clean code. Always eager to learn new technologies."></textarea>
            </div>
             <Button>{t.saveChanges}</Button>
          </CardContent>
        </Card>
        
        <Separator />

        <Card>
            <CardHeader>
                <CardTitle>{t.verification}</CardTitle>
                <CardDescription>{t.verifyWork}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert>
                    <Briefcase className="h-4 w-4" />
                    <AlertTitle>{t.currentPosition}</AlertTitle>
                    <AlertDescription>
                        <p className="font-semibold">Senior Frontend Developer at Innovate Inc.</p>
                        <p className="text-sm text-muted-foreground">{t.positionVerified}</p>
                    </AlertDescription>
                </Alert>
                <div className="space-y-2">
                    <Label htmlFor="work-email">{t.verifyNewEmail}</Label>
                    <div className="flex gap-2">
                        <Input id="work-email" type="email" placeholder="you@company.com" />
                        <Button variant="outline">{t.sendVerification}</Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Separator />
        
        <Card>
          <CardHeader>
            <CardTitle>{t.account}</CardTitle>
            <CardDescription>{t.manageAccountSettings}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input id="email" type="email" defaultValue="chris.peta@example.com" disabled />
              </div>
              <Button variant="outline">{t.changePassword}</Button>

              <div className="space-y-4 rounded-lg border p-4">
                  <h4 className="font-medium">{t.displayPreferences}</h4>
                  <div className="flex items-center justify-between">
                      <Label htmlFor="show-job-info" className="flex flex-col gap-1">
                          <span>{t.showPositionOnPosts}</span>
                          <span className="font-normal text-muted-foreground text-xs">{t.showPositionDesc}</span>
                      </Label>
                      <Switch id="show-job-info" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                     <Label htmlFor="appearance" className="flex flex-col gap-1">
                          <span>{t.appearance}</span>
                          <span className="font-normal text-muted-foreground text-xs">{t.appearanceDesc}</span>
                      </Label>
                      <ThemeSwitcher />
                  </div>
              </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t.logout}
            </Button>
          </CardFooter>
        </Card>
        
        <Separator />
        
        <Card>
            <CardHeader>
                <CardTitle>{t.langAndRegion}</CardTitle>
                <CardDescription>{t.langAndRegionDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="language">{t.language}</Label>
                     <Select defaultValue="en" onValueChange={(value) => setSelectedLanguage(value as Language)}>
                        <SelectTrigger id="language">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español (Spanish)</SelectItem>
                            <SelectItem value="fr">Français (French)</SelectItem>
                            <SelectItem value="de">Deutsch (German)</SelectItem>
                            <SelectItem value="ja">日本語 (Japanese)</SelectItem>
                            <SelectItem value="zh">简体中文 (Mandarin)</SelectItem>
                            <SelectItem value="sn">ChiShona</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">{t.languageDesc}</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button>{t.saveLanguage}</Button>
            </CardFooter>
        </Card>


      </div>
    </div>
  );
}
