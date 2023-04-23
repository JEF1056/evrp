import { Table, Mask, Badge, Button, Stats } from "react-daisyui";

function RoutesDataComponent() {
  return (
    <div className="overflow-x-auto max-h-60 lg:max-h-128">
      <Stats className="rounded-none w-full bg-base-200">
        <Stats.Stat className="place-items-center">
          <Stats.Stat.Item variant="desc">S</Stats.Stat.Item>
          <Stats.Stat.Item variant="value">{1}</Stats.Stat.Item>
          <Stats.Stat.Item variant="desc">Miles</Stats.Stat.Item>
        </Stats.Stat>

        <Stats.Stat className="place-items-center">
          <Stats.Stat.Item variant="value">{1}</Stats.Stat.Item>
          <Stats.Stat.Item variant="desc">Total Trip Time</Stats.Stat.Item>
        </Stats.Stat>

        <Stats.Stat className="place-items-center">
          <Stats.Stat.Item variant="value">{1}</Stats.Stat.Item>
          <Stats.Stat.Item variant="desc">Time in traffic</Stats.Stat.Item>
        </Stats.Stat>
      </Stats>
      <Table>
        <Table.Head className="hidden">
          <span>Name</span>
          <span>Job</span>
          <span>Favorite Color</span>
          <span />
        </Table.Head>

        <Table.Body>
          <Table.Row>
            <div className="flex items-center space-x-3 truncate">
              <Mask
                variant="squircle"
                src="http://daisyui.com/tailwind-css-component-profile-2@56w.png"
              />
              <div>
                <div className="font-bold">Hart Hagerty</div>
                <div className="text-sm opacity-50">United States</div>
              </div>
            </div>
            <div>
              Zemlak, Daniel and Leannon
              <br />
              <Badge color="ghost" size="sm">
                Desktop Support Technician
              </Badge>
            </div>
            <div>Purple</div>
            <Button color="ghost" size="xs">
              details
            </Button>
          </Table.Row>

          <Table.Row>
            <div className="flex items-center space-x-3 truncate">
              <Mask
                variant="squircle"
                src="http://daisyui.com/tailwind-css-component-profile-3@56w.png"
              />
              <div>
                <div className="font-bold">Brice Swyre</div>
                <div className="text-sm opacity-50">China</div>
              </div>
            </div>
            <div>
              Carrol Group
              <br />
              <Badge color="ghost" size="sm">
                Tax Accountant
              </Badge>
            </div>
            <div>Red</div>
            <Button color="ghost" size="xs">
              details
            </Button>
          </Table.Row>

          <Table.Row>
            <div className="flex items-center space-x-3 truncate">
              <Mask
                variant="squircle"
                src="http://daisyui.com/tailwind-css-component-profile-4@56w.png"
              />
              <div>
                <div className="font-bold">Marjy Ferencz</div>
                <div className="text-sm opacity-50">Russia</div>
              </div>
            </div>
            <div>
              Rowe-Schoen
              <br />
              <Badge color="ghost" size="sm">
                Office Assistant I
              </Badge>
            </div>
            <div>Crimson</div>
            <Button color="ghost" size="xs">
              details
            </Button>
          </Table.Row>

          <Table.Row>
            <div className="flex items-center space-x-3 truncate">
              <Mask
                variant="squircle"
                src="http://daisyui.com/tailwind-css-component-profile-5@56w.png"
              />
              <div>
                <div className="font-bold">Yancy Tear</div>
                <div className="text-sm opacity-50">Brazil</div>
              </div>
            </div>
            <div>
              Wyman-Ledner
              <br />
              <Badge color="ghost" size="sm">
                Community Outreach Specialist
              </Badge>
            </div>
            <div>Indigo</div>
            <Button color="ghost" size="xs">
              details
            </Button>
          </Table.Row>
        </Table.Body>

        <Table.Footer className="hidden" />
      </Table>
    </div>
  );
}

export default RoutesDataComponent;
