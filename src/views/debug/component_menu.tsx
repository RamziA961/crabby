import React from "react";
import { Button, IconButton, Slider, Toggle } from "@ui";
import reactsvg from "../../assets/react.svg";

export function ComponentMenu(): React.ReactElement{
    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-4">
                <Slider color="primary"/>
                <Slider color="success"/>
                <Slider color="warning"/>
                <Slider color="secondary"/>
            </div>
            <div className="flex gap-2">
                <Button
                    iconProps={{
                        iconPosition:"end",
                        icon: <img src={reactsvg}/>
                    }}
                >
                    Hello
                </Button>
                <Button color="primary">Hello</Button>
                <Button color="secondary">Hello</Button>
                <Button color="info">Hello</Button>
                <Button color="error">Hello</Button>
                <Button color="warning">Hello</Button>
                <Button color="accent">Hello</Button>
                <Button color="success">Hello</Button>
                <Button color="ghost">Hello</Button>
                <Button color="link">Hello</Button>
            </div>
            <div className="flex gap-2">
                <Button
                    iconProps={{
                        iconPosition:"end",
                        icon: <img src={reactsvg}/>
                    }}
                    outline
                >
                    Hello
                </Button>
                <Button outline color="primary">Hello</Button>
                <Button outline color="secondary">Hello</Button>
                <Button outline color="info">Hello</Button>
                <Button outline color="error">Hello</Button>
                <Button outline color="warning">Hello</Button>
                <Button outline color="accent">Hello</Button>
                <Button outline color="success">Hello</Button>
                <Button outline color="ghost">Hello</Button>
                <Button outline color="link">Hello</Button>
            </div>
            <div className="flex gap-2">
                <IconButton size={"md"} color="primary"><img src={reactsvg}/></IconButton>
                <IconButton size={"md"} color="secondary"><img src={reactsvg}/></IconButton>
                <IconButton size={"md"} color="info"><img src={reactsvg}/></IconButton>
                <IconButton size={"md"} color="error"><img src={reactsvg}/></IconButton>
                <IconButton size={"md"} color="warning"><img src={reactsvg}/></IconButton>
                <IconButton size={"md"} color="accent"><img src={reactsvg}/></IconButton>
                <IconButton size={"md"} color="success"><img src={reactsvg}/></IconButton>
                <IconButton size={"md"} color="ghost"><img src={reactsvg}/></IconButton>
            </div>
            <div className="flex gap-2">
                <IconButton outline size={"md"} color="primary"><img src={reactsvg}/></IconButton>
                <IconButton outline size={"md"} color="secondary"><img src={reactsvg}/></IconButton>
                <IconButton outline size={"md"} color="info"><img src={reactsvg}/></IconButton>
                <IconButton outline size={"md"} color="error"><img src={reactsvg}/></IconButton>
                <IconButton outline size={"md"} color="warning"><img src={reactsvg}/></IconButton>
                <IconButton outline size={"md"} color="accent"><img src={reactsvg}/></IconButton>
                <IconButton outline size={"md"} color="success"><img src={reactsvg}/></IconButton>
                <IconButton outline size={"md"} color="ghost"><img src={reactsvg}/></IconButton>
            </div>
            <div className="flex gap-2">
                <Toggle size={"md"} color="primary"/>
                <Toggle size={"md"} color="secondary"/>
                <Toggle size={"md"} color="info"/>
                <Toggle size={"md"} color="error"/>
                <Toggle size={"md"} color="warning"/>
                <Toggle size={"md"} color="accent"/>
                <Toggle size={"md"} color="success"/>
            </div>
        </div>
    );
}
