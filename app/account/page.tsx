import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Page() {
    return (
        <div className="flex min-h-svh w-full p-6 md:p-10 gap-6">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Profile info</CardTitle>
                    </CardHeader>
                    <CardContent className={"flex flex-col gap-3"}>
                        <div className="flex flex-col gap-0.5">
                            <Label
                                className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                Name
                            </Label>
                            <Label
                                className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                Name
                            </Label>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <Label
                                className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                Email
                            </Label>
                            <Label
                                className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                some.random@email.com
                            </Label>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <Label
                                className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                Phone
                            </Label>
                            <Label
                                className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                +372 2w834957
                            </Label>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <Label
                                className={`relative text-base text-muted-foreground peer-checked:line-through font-medium`}>
                                Address
                            </Label>
                            <Label
                                className={`relative text-base text-foreground peer-checked:line-through font-medium`}>
                                Idk
                            </Label>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="w-full">
                <Card>

                </Card>
            </div>
        </div>
    );
}
